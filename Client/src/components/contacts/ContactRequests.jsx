import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUser } from '.././App';
import Search from '.././Search';
import Sort from '.././Sort';
import Delete from '.././Delete';
import Update from '.././Update';
import '../../style/Posts.css';
import { userService } from '../../services/usersServices';

function ContactRequests() {
    const [userData, setUserData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        setError(null);
        if (!currentUser || !currentUser.id) {
            setError("User not logged in");
            return;
        }
        const fetchData = async () => {
            try {
                await userService.getByValue(
                    currentUser.autoId,
                    "contact",
                    "Events",
                    { contactId: currentUser.id },
                    (result) => {
                        console.log("get successful:", result);
                        setUserData(result);
                        setDisplayData(result);
                        setIsChange(1);
                    },
                    (error) => {
                        console.log("get was unsuccessful", error);
                        setError("Error loading data");
                    }
                );
            } catch (error) {
                console.log("Unexpected error:", error);
                setError("Unexpected error loading data");
            }
        };
        fetchData();
    }, [currentUser, isChange]);

    const handleShowDetails = (id) => {
        navigate(`/${currentUser.type}/${currentUser.id}/request-details/${id}`);
    };

    return (
        <>
            <div className='control'>
                <Sort
                    type="requests"
                    setIsChange={setIsChange}
                    options={["date", "hospital", "department", "patientId"]}
                    userData={userData}
                    setData={setDisplayData}
                />

                <Search
                    type="requests"
                    setIsChange={setIsChange}
                    options={["All", "hospital", "department", "patientId"]}
                    data={userData}
                    setData={setDisplayData}
                />
            </div>

            {error && <div className="error">{error}</div>}

            <table className="requests-table">
                <tbody>
                    {displayData && displayData.length > 0 ? (
                        displayData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.startTime}</td>
                                <td>{item.endTime}</td>
                                <td>{item.roomNumber}</td>
                                <td>{item.hospital}</td>
                                <td>{item.department}</td>
                                <td>{item.patientId}</td>
                                <td>
                                    <button onClick={() => handleShowDetails(item.id)}>Details</button>
                                    {item.contactId === currentUser.id && (
                                        <>
                                            <Update
                                                type="Events"
                                                itemId={item.id}
                                                setIsChange={setIsChange}
                                                inputs={["patientId", "hospital", "department", "roomNumber", "date", "startTime", "endTime"]}
                                                defaultValue={item}
                                            />
                                            <Delete
                                                type="Events"
                                                itemId={item.id}
                                                setIsChange={setIsChange}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8}>No data to display</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default ContactRequests;