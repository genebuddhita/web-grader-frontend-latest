// import React, { useState, useEffect } from 'react';
// import Navbarprof from '../components/Navbarprof'
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Link } from 'react-router-dom';

// function Testernaja() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const classData = location.state;
//   const Email = classData.Email;
//   const classId = classData.classid;
//   const oldlab = classData.lab;
//   const oldlabname = classData.labname;
//   const [lab, setLab] = useState(null);


//   const [showAlert, setShowAlert] = useState(false);

//   const [labNum, setLabNum] = useState('');
//   const [labName, setLabName] = useState('');
//   const [publishDate, setPublishDate] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [totalQNum, setTotalQNum] = useState('');
//   const [sections, setSections] = useState([1, 2, 3, 4, 5]); //ใส่ sec ที่จะเอา
//   const [Question, setScores] = useState([]);
//   const [submittedData, setSubmittedData] = useState(null);
//   const [checkedSections, setCheckedSections] = useState([]);
//   const currentDate = new Date().toISOString().slice(0, 16);
//   const [submittedDates, setSubmittedDates] = useState({});
//   const [isLoading, setIsLoading] = useState(true); // Add isLoading state


//   useEffect(() => {
//     const fetchLab = async () => {
//       try {
//         const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/TA/class/Assign/data?CSYID=${classId}&labnumber=${oldlab}`);
//         const data = await response.json();
//         console.log('sections:', data);
//         setTotalQNum(data.Question.length);
//         setScores(data.Question)
//         setCheckedSections(data.section)
//         setSubmittedDates(data.LabTime)
//         console.log(submittedDates)
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     const fetchSection = async () => {
//       try {
//         const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/section?CSYID=${classId}`);
//         const data = await response.json();
//         console.log('sections:', data);
//         setSections(data);
        

//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchLab()
//     fetchSection()

//     setLabNum(oldlab)
//     setLabName(oldlabname)

//     //Set QuestionNumber
//     const event = {
//       target: {
//         value: totalQNum 
//       }
//     };
//     handleTotalQNumChangeWrapper(event);

//     //Set QuestionScore
//     Question.forEach(item => {
//       const id = item.id;
//       const score = item.score;
//       handleScoreChange(id, score);
//     });
    
//     //Set Publish&Due
    

//     setIsLoading(false)
//   }, [totalQNum]);

//   const handlePublishDateChange = (e, section) => {
//     const selectedPublishDate = new Date(e.target.value);
//     const formattedPublishDate = selectedPublishDate.toISOString().slice(0, 16);
//     // Update state with formatted date
//     setSubmittedDates(prevState => ({
//       ...prevState,
//       [section]: {
//         ...prevState[section],
//         publishDate: formattedPublishDate,
//       }
//     }));
//   };
  
//   const handleDueDateChange = (e, section) => {
//     const selectedDueDate = new Date(e.target.value);
//     const formattedDueDate = selectedDueDate.toISOString().slice(0, 16);
//     // Update state with formatted date
//     setSubmittedDates(prevState => ({
//       ...prevState,
//       [section]: {
//         ...prevState[section],
//         dueDate: formattedDueDate,
//       }
//     }));
//   };
  
  
  
//   const handleCheckboxChange = (section) => {
//     if (checkedSections.includes(section)) {
//       setCheckedSections(checkedSections.filter((item) => item !== section));
//     } else {
//       setCheckedSections([...checkedSections, section]);
//     }
//     setSections([...sections].sort((a, b) => a - b));
//   };

//   const handleTotalQNumChangeWrapper = (e) => {
//     handleTotalQNumChange(e);
//   };

//   const handleTotalQNumChange = (e) => {
//     const numQuestions = parseInt(e.target.value, 10);
//     setTotalQNum(numQuestions);

//     const newScores = Array.from({ length: numQuestions }, (_, index) => ({
//       id: index + 1,
//       score: 1,
//     }));
//     setScores(newScores);
//   };
  

//   const handleScoreChange = (id, score) => {
//     const updatedScores = Question.map((item) =>
//       item.id === id ? { ...item, score } : item
//     );
//     setScores(updatedScores);
//   };

//   const isFormValid = () => {
//     return (
//       labNum !== '' &&
//       labName !== '' &&
//       checkedSections !== null &&
//       checkedSections !== undefined &&
//       checkedSections.length > 0 &&
//       checkedSections.every(section => 
//         submittedDates[section] && 
//         submittedDates[section].publishDate && 
//         submittedDates[section].dueDate &&
//         new Date(submittedDates[section].publishDate) <= new Date(submittedDates[section].dueDate)
//       )
//     );
//   };
  
//   const handleButtonClick = async () => {
//     const formData = new FormData();
//     formData.append('Creator', Email);
//     formData.append('labNum', labNum);
//     formData.append('labName', labName);
//     formData.append('CSYID', classId);
//     formData.append('Question', JSON.stringify(Question)); // Stringify Question array
//     formData.append('submittedDates', JSON.stringify(submittedDates)); // Stringify submittedDates object
//     if (isFormValid()) {
//       try {
        
//         const response = await fetch(`http://${process.env.REACT_APP_BACKENDHOST}:${process.env.REACT_APP_BACKENDPORT}/TA/class/Assign/Create`, {
//               method: 'POST',
//               body: formData,
//         })
//         console.log(response)

//       } catch (error) {
//         console.error('Error');
//       }

      
  
//       setShowAlert(true);
//       console.log('Form submitted!',formData);
//     } else {
//       console.log('Please fill in all fields correctly.');
//     }
//   };
  

//   const handleAlertClose = () => {
//     setShowAlert(false);
//   };

//   return (
//     <div>
//       <Navbarprof />
//       <br />
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
          
// <div className="media d-flex align-items-center">
//       <span style={{ margin: '0 10px' }}></span>
//         <img
//           className="mr-3"
//           src="https://cdn-icons-png.flaticon.com/512/3426/3426653.png"
//           style={{ width: '40px', height: '40px' }}
//         />
//         <span style={{ margin: '0 10px' }}></span>
//         <div className="card" style={{ width: '30rem', padding: '10px' }}>
//           <h5>210xxx comp prog 2566/2 sec1</h5>
//           <h6>Instructor: Name Surname</h6>
//         </div>
//       </div>
//       <br />
//       <div className="card" style={{ marginLeft: '10em', marginRight: '10em' }}>
//         <div className="card-header">
//           <h5>Edit assignment</h5>
//         </div>
//         <div className="card-body">
//           <form className="row g-3">
//             <div className="col-md-6">
//               <label htmlFor="LabNum" className="form-label">Lab Number*</label>
//               <input type="number" min="1" className="form-control" id="LabNum" value={oldlab} onChange={(e) => setLabNum(e.target.value)} />
//             </div>
//             <div className="col-md-6">
//               <label htmlFor="LabName" className="form-label">Lab Name*</label>
//               <input type="name" className="form-control" id="LabName" value={oldlabname} onChange={(e) => setLabName(e.target.value)} />
//             </div>

//             <div className="col-6">
//               <label htmlFor="inputlink" className="form-label">Attach Link</label>
//               <input type="text" className="form-control" id="inputlink" placeholder="link1, link2 or -" />
//             </div>
//             <div className="col-md-6">
//               <label htmlFor="inputQnum" className="form-label">Total Question Number*</label>
//               <input type="number" min="1" className="form-control" id="inputQnum" value={totalQNum} onChange={handleTotalQNumChange} />
//             </div>

//             {Question.map((scoreItem) => (
//               <div key={scoreItem.id} className="col-md-2">
//                 <label htmlFor={`inputScore${scoreItem.id}`} className="form-label">
//                   Score Q.{scoreItem.id}
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   className="form-control"
//                   id={`inputScore${scoreItem.id}`}
//                   value={scoreItem.score}
//                   onChange={(e) => handleScoreChange(scoreItem.id, e.target.value)}
//                 />
//               </div>
//             ))}

//             <div className="col-md-12">
//               <label htmlFor="inputState" className="form-label">Section*</label>
//               <br />
//               {sections.map((section) => (
//                 <div key={section} className="form-check form-check-inline">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`inlineCheckbox${section}`}
//                     value={section}
//                     checked={checkedSections.includes(section)}
//                     onChange={() => handleCheckboxChange(section)}
//                   />
//                   <label className="form-check-label" htmlFor={`inlineCheckbox${section}`}>
//                     {section}
//                   </label>
//                 </div>
//               ))}
//             </div>
//               <br></br>
//               {sections
//   .filter(section => checkedSections.includes(section))
//   .map((section) => (
//     <div key={section} className="row">
//       <div className="col-md-6">
//         <label htmlFor={`PublishDate${section}`} className="form-label">Publish Date* for sec{section}</label>
//         <input
//           type="datetime-local"
//           className="form-control"
//           id={`publishdate${section}`}
//           value={submittedDates[section]?.publishDate || ''}
//           onChange={(e) => handlePublishDateChange(e, section)}
//           min={currentDate}
//         />
//       </div>
//       <div className="col-md-6">
//         <label htmlFor={`DueDate${section}`} className="form-label">Due Date* for sec{section}</label>
//         <input
//           type="datetime-local"
//           className="form-control"
//           id={`duedate${section}`}
//           value={submittedDates[section]?.dueDate || ''}
//           onChange={(e) => handleDueDateChange(e, section)}
//           min={submittedDates[section]?.publishDate || currentDate}
//         />
//       </div>
//     </div>
//   ))}


//             <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                 <button type="button" className="btn btn-primary" onClick={() => navigate("/AssignList", { state: { Email: Email,classid:classId} })}>Back</button>
//               <button type="button" className="btn btn-primary" id="liveToastBtn" onClick={handleButtonClick} disabled={!isFormValid()}>Submit</button>
//             </div>

//             {showAlert && (
//               <div className="alert alert-success d-flex align-items-center" role="alert">
//                 Assignment created successfully
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Testernaja;
