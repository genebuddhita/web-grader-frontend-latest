import React, { useState, useEffect } from 'react';
import Navbarprof from '../components/Navbarprof'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Homeprof() {
  const navigate = useNavigate();
  const location = useLocation();
  const classData = location.state;
  const Email = '9876543210@student.chula.ac.th';
  /* const Email = classData.Email; */
  console.log(classData)

  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(true);

  const [expandedYear, setExpandedYear] = useState(null);
  const [isdelete, setdelete] = useState(false);
  

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [formData, setFormData] = useState({
    Creator: '',
    ClassName: '',
    ClassID: '',
    SchoolYear: ''
  });

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/ST/user/profile?Email=${Email}`);
      const data = await response.json();
      console.log('user:', data);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/TA/class/classes?Email=${Email}`);
      const data = await response.json();
      console.log('class:', data);
      const sortedCourses = Object.fromEntries(Object.entries(data).sort((a, b) => b[0].localeCompare(a[0])));
  
      setCourses(sortedCourses);
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };
  
  

  useEffect(() => {
    try{if(location.state.delete)setdelete(true)}catch{setdelete(false)}
    fetchUserData();
    fetchCourses();
    setReady(true);
  }, []);
  

  const toggleYear = (year) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };
  
  const handleToggleExpand = () => {
    setExpanded(!expanded);
    setFormData({
      Creator: userData.Email,
      ClassName: '',
      ClassID: '',
      SchoolYear: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      Creator:'',
      ClassName: '',
      ClassID: '',
      SchoolYear: ''
    });
    setExpanded(false);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleDeleteClose = () => {
    setDeleteAlert(false);
  };
  
  const handleCreateClick = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      
      const response = await axios.post(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/TA/class/create`, formData)
      console.log(response)
      if (response.data.Status) {
        fetchCourses();
        setShowAlert(true);
      } else {
      }
    } catch (error) {
      console.error('Error');
    }
  };

  return (
    <div>
      <Navbarprof />
      {isdelete && deleteAlert ? (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          Class deleted successfully
          <button type="button" className="btn-close align-items-right" aria-label="Close" onClick={handleDeleteClose}></button>
        </div>
      ) : null}

      {showAlert && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          Class created successfully
          <button type="button" className="btn-close align-items-right" aria-label="Close" onClick={handleAlertClose}></button>
        </div>
      )}

      <br />
      <div className="d-flex align-items-center">
        <h5 className="me-2" style={{ marginLeft: '10px' }}>Course</h5>
        {!expanded ? (<button onClick={handleToggleExpand} className="btn btn-outline-secondary" type="button" id="button-addon2">+ New</button>) : null}
      </div>

      {!expanded ? null : (
        <div className="container d-flex justify-content-center">
          <div className="card" style={{ width: '800px' }}>
            <div className="card-header">
              <h4>Create Class</h4>
            </div>
            <div className="card-body">
              <form className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="inputID" className="form-label">Class ID</label>
                  <input type="text" name="ClassID" className="form-control" id="inputID" placeholder="e.g., 2301240" onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputYear" className="form-label">Academic year/Semester</label>
                  <input type="text" name="SchoolYear" className="form-control" id="inputYear" placeholder="e.g., 2021/2" onChange={handleChange} />
                </div>
                <div className="col-6">
                  <label htmlFor="inputName" className="form-label">Class Name</label>
                  <input type="text" name="ClassName" className="form-control" id="inputClass" placeholder="e.g., Introduction to Computer Science" onChange={handleChange} />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                  <div>
                    <button type="button" className="btn btn-primary" onClick={handleCreateClick}>Create</button>
                    <br />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {courses && !ready ? (
        <main>
          <div>
            <br></br>
            {/* วนลูปเพื่อแสดง container แยกตามปีการศึกษา */}
            {Object.entries(courses).map(([year, classes]) => (
              <div key={year} className="container-lg mb-3 bg-light" style={{ padding: '10px' }}>
                <h5 onClick={() => toggleYear(year)} style={{ cursor: 'pointer' }}>
                  {year} {expandedYear === year ? " (- Click to collapse)" : " (+ Click to expand)"}
                </h5>
                {expandedYear === year && (
                  <div className="row row-cols-1 row-cols-md-5 g-2">
                    {/* วนลูปเพื่อแสดงข้อมูลคอร์สในแต่ละปีการศึกษา */}
                    {classes.map(course => (
                      <div key={course.ID} className="col">
                        <div className="card h-100" style={{ width: '15rem' }}>
                          <div>
                            <img src={course.Thumbnail ? "/Thumbnail/" + course.Thumbnail : "https://cdn-icons-png.flaticon.com/512/3643/3643327.png"} className="card-img-top" style={{ padding: '15px', width: '100%', height: '100%' }} alt="..." />
                          </div>
                          <div className="card-body" style={{ overflowY: 'scroll' }}>
                            <h5 className="card-title">{course.ClassName}</h5>
                            <p className="card-text">{course.ClassID}</p>
                            <button onClick={() => navigate("/AssignList", { state: { Email: Email, classid: course.ID } })} className="btn btn-primary">View course</button>
                          </div>
                          <div className="card-footer">
                            <div style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={() => navigate("/ClassEdit", { state: { Email: Email, classid: course.ID, ClassID: course.ClassID, SchoolYear: year, ClassName: course.ClassName } })}>Edit</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      ) : (
        <div className="container-lg mb-3 bg-light" style={{ padding: '10px' }}>
          {courses && Object.keys(courses).length === 0 && ready ? (
            <div>
              <h5>No class available</h5>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Homeprof
