import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TextField
} from '@material-ui/core'

const CourseOffer = () => {
  const url = process.env.APIURL
  const [componentTotalJson, setComponentTotalJson] = useState([])
  const [componentDoneJson, setComponentDoneJson] = useState([])
  const [branchesJson, setBranchesJson] = useState([])
  const [offer, setOffer] = useState(true)
  const [courses, setCourses] = useState([])
  const [currCourse, setCurrCourse] = useState('')
  const [currDetails, setCurrDetails] = useState('')
  const [currComponent, setCurrComponent] = useState('')
  const [isPrerequisite, setIsPrerequisite] = useState('No')
  const [currPrerequisite, setCurrPrerequisite] = useState('')
  const [currMarks, setCurrMarks] = useState(100)
  const [currParts, setCurrParts] = useState('1')
  const [currBranches, setCurrBranches] = useState([])
  const [currProf, setCurrProf] = useState([])
  const router = useRouter()

  const {
    query: {
      session_year,
      session,
      programme,
      branch,
      course_id,
      branch_id,
      sem,
      component_name,
      component_code,
      component_total,
      component_done,
      branches
    }
  } = router

  const handleDelete = async el => {
    try {
      await axios.delete(`${url}deleteOffers`, { data: { id: el.id.toString() } })
    } catch (err) {
      console.log(err)
    }
    const arr = componentDoneJson.filter(it => it.id !== el.id)
    setComponentDoneJson(arr)
    router.push({
      pathname: '/courseoffer',
      query: {
        session_year,
        session,
        programme,
        branch,
        course_id,
        branch_id,
        sem,
        component_name,
        component_code,
        component_total: JSON.stringify(componentTotalJson),
        component_done: JSON.stringify(arr),
        branches: JSON.stringify(branchesJson)
      }
    })
  }

  const handleAdd = el => {
    setCurrComponent(el)
    setOffer(false)
  }

  const handleSave = () => {}

  useEffect(() => {
    const getMyCourses = async () => {
      const data2 = {
        session_year
      }
      try {
        const res = await axios.post(`${url}getCourses`, data2)
        setCourses(res.data)
        const t = `${res.data[0].sub_code}-${res.data[0].sub_name} ${res.data[0].lecture}-${res.data[0].tutorial}-${res.data[0].practical}`
        setCurrCourse(t)
        setCurrDetails(res.data[0])
      } catch (err) {
        console.log(err)
      }
    }
    getMyCourses()
    const arr = []
    for (let i = 0; i < parseInt(currParts); i++) {
      arr.push('')
    }
    setCurrProf(arr)
    setBranchesJson(JSON.parse(branches))
    arr[0] = branchesJson?.[0]?.name
    setCurrBranches(arr)
    setComponentTotalJson(JSON.parse(component_total))
    setComponentDoneJson(JSON.parse(component_done))
  }, [])

  const courseYear = {}
  if (courses.length > 0) {
    courses.forEach(el => {
      const t = `${el.sub_code}-${el.sub_name} ${el.lecture}-${el.tutorial}-${el.practical}`
      courseYear[t] = el
    })
  }

  return (
    <div>
      {offer && (
        <div>
          <Button variant='outlined' onClick={() => router.push('/course')}>
            Go Back
          </Button>
          <Typography>Session Year: {session_year}</Typography>
          <Typography>Session: {session}</Typography>
          <Typography>Programme: {programme}</Typography>
          <Typography>Branch: {branch}</Typography>
          <Typography>Dept: {branch_id}</Typography>
          <Typography>Semester: {sem}</Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Category</TableCell>
                <TableCell>Paper Type</TableCell>
                <TableCell>Course Code</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Mapped Faculty/ Marks Upload Rights</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {componentTotalJson.map((el, index) => {
                const currCode = component_code + el.sequence
                let b = []
                componentDoneJson.forEach(it => {
                  if (it.sub_category === currCode) b.push(it)
                })
                if (b.length > 0) {
                  return (
                    <TableRow key={index}>
                      <TableCell>{currCode}</TableCell>
                      <TableCell>{el.status}</TableCell>
                      <TableCell>{b[0].sub_code}</TableCell>
                      <TableCell>{b[0].sub_name}</TableCell>
                      <TableCell>{b[0].created_by}</TableCell>
                      <TableCell>
                        <Button variant='contained' color='secondary' onClick={() => handleDelete(b[0])}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                } else {
                  return (
                    <TableRow key={index}>
                      <TableCell>{currCode}</TableCell>
                      <TableCell>{el.status}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell>
                        <Button variant='contained' color='primary' onClick={() => handleAdd(currCode)}>
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {offer || (
        <div>
          <button type='button' onClick={e => setOffer(true)}>
            Close
          </button>
          <div>Session Year: {session_year}</div>
          <div>Session: {session}</div>
          <div>Programme: {programme}</div>
          <div>Branch: {branch}</div>
          <div>Dept: {branch_id}</div>
          <div>Semester: {sem}</div>
          <label id='course'>Course Name: </label>
          <select
            id='course'
            value={currCourse}
            onChange={e => {
              setCurrCourse(e.target.value)
              setCurrDetails(courseYear[e.target.value])
            }}
          >
            {courses.map(el => {
              const t = el.sub_code + '-' + el.sub_name + ' ' + el.lecture + '-' + el.tutorial + '-' + el.practical
              return <option value={t}>{t}</option>
            })}
          </select>
          <div>Introduced Session Year: {currDetails.wef_year}</div>
          <div>Lecture: {currDetails.lecture}</div>
          <div>Tutorial: {currDetails.tutorial}</div>
          <div>Practical: {currDetails.practical}</div>
          <div>Credit Hour: {currDetails.credit_hours}</div>
          <div>Contact Hours: {currDetails.contact_hours}</div>
          <div>Course Type: {currDetails.sub_type}</div>
          <div>Course Category: {currComponent}</div>
          <label id='prerequisite'>Prerequisite</label>
          <select
            id='prerequisite'
            value={isPrerequisite}
            onChange={e => {
              setIsPrerequisite(e.target.value)
              if (e.target.value === 'No') setCurrPrerequisite('')
              else setCurrPrerequisite(courses.filter(el => el.sub_name != currDetails.sub_name)[0])
            }}
          >
            <option value='No'>No</option>
            <option value='Yes'>Yes</option>
          </select>
          {isPrerequisite === 'Yes' && (
            <div>
              <label id='precourse'>Prerequisite Course</label>
              <select id='precourse' value={currPrerequisite} onChange={e => setCurrPrerequisite(e.target.value)}>
                {courses.map(el => {
                  if (el.sub_name !== currDetails.sub_name) return <option value={el.sub_name}>{el.sub_name}</option>
                })}
              </select>
            </div>
          )}
          <div>Full Marks: {currMarks}</div>
          <label id='parts'>Parts: </label>
          <select
            value={currParts}
            id='parts'
            onChange={e => {
              setCurrParts(e.target.value)
              const arr = []
              const arr2 = []
              for (let i = 0; i < parseInt(e.target.value); i++) {
                arr.push('')
                arr2.push(branchesJson[0].name)
              }
              setCurrProf(arr)
              setCurrBranches(arr2)
            }}
          >
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
          </select>

          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Department</th>
                <th>Faculty</th>
                <th>Marks Upload Right</th>
              </tr>
            </thead>
            <tbody>
              {currProf.map((el, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      onChange={e => {
                        const curr = currBranches
                        curr[index] = e.target.value
                        setCurrBranches(curr)
                      }}
                    >
                      {branchesJson.map(el => {
                        return <option value={el.name}>{el.name}</option>
                      })}
                    </select>
                  </td>
                  <td>Faculty Table not given</td>
                  <td>{index === 0 ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type='button' onClick={e => handleSave()}>
            Save
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseOffer
