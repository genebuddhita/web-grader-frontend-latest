import React, { useState, useEffect } from 'react';
import Navbarprof from '../components/Navbarprof';
import { useNavigate, useLocation } from 'react-router-dom';

function StudentList() {
  const navigate = useNavigate();
  const location = useLocation();

  const classData = location.state;
  const Email = classData.Email;
  const classId = classData.classid;

  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [maxTotal, setMaxTotal] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // เริ่มต้นเป็น true เพื่อให้แสดง Loading... เมื่อเริ่มโหลดข้อมูล
  const [showname, setshowname] = useState([])

  useEffect(() => {
    fetchData();
    fetchUserData();
    fetchName();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/TA/Student/List/score?CSYID=${classId}`);
      const data = await response.json();
      setStudents(data.transformed_data);
      setMaxTotal(data.TotalMax);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Display an error message to the user
    } finally {
      setIsLoading(false); // หยุดแสดง Loading เมื่อโหลดเสร็จสิ้น
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/ST/user/profile?Email=${Email}`);
      const userdata = await response.json();
      setUserData(userdata);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Display an error message to the user
    }
  };

  const fetchName = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/TA/Student/List?CSYID=${classId}`);
      const dataname = await response.json();
      setshowname(dataname);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Display an error message to the user
    }
  };

  const handleExport = async () => {
    try {
      const formData = new FormData();
      formData.append('CSV_data', JSON.stringify({
        CSV_data: students, // Convert CSV_data to JSON string
        MaxTotal: maxTotal,
        CSYID: classId
    }),);
  
      const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/TA/Student/List/CSV`, {
            method: 'POST',
            body: formData
      })
      console.log(response)
      const csvData = await response.text();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
      // Display an error message to the user
    }
  };
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <Navbarprof />
      <br />
      <div className="media d-flex align-items-center">
        <span style={{ margin: '0 10px' }}></span>
        <img className="mr-3" src="https://cdn-icons-png.flaticon.com/512/3426/3426653.png" style={{ width: '40px', height: '40px' }} />
        <span style={{ margin: '0 10px' }}></span>
        <div className="card" style={{ width: '30rem', padding: '10px' }}>
          <h5>210xxx comp prog 2566/2 sec1</h5>
          <h6>Instructor: Name Surname</h6>
      </div>
        <button type="button" className="btn btn-secondary" style={{ marginLeft: '40em' }} onClick={handleExport}>Export</button>
      </div>
      <br />
      <div className="card" style={{ marginLeft: '10em', marginRight: '10em' }}>
        <div className="card-header">
          <h5>Student Name List</h5>
        </div>
        <div className="card-body" style={{ overflowY: 'scroll' }}>
          {/* Search input */}
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search ID or Name" aria-label="Search" onChange={handleSearch} />
          </form>
          <br />
          {/* Loading indicator */}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ol className="list-group list-group-numbered">
              {showname.length === 0 ? (
                <div className="text-center">No students available</div>
              ) : (
                showname.map((student, index) => (
                  <div key={index} className="list-group-item d-flex">
                    <div>
                      <span style={{marginLeft:'1rem'}} className="fw-bold">Section:</span> {student.Section} | <span className="fw-bold">UID:</span> {student.UID} | <span className="fw-bold">Name:</span> {student.Name}
                    </div>
                  </div>
                ))
              )}
            </ol>
          )}
          <br />
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="button" className="btn btn-primary" onClick={() => navigate("/AssignList", { state: { Email, classid: classId } })}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentList;
