import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

const Course = () => {
  const url = process.env.APIURL
  const [years, setYears] = useState([])
  const [sessions, setSessions] = useState([])
  const [courses, setCourses] = useState([])
  const [branches, setBranches] = useState([])
  const [semesters, setSemesters] = useState('0')
  const [components, setComponents] = useState([])
  const [offers, setOffers] = useState([])
  const [currYear, setCurrYear] = useState('')
  const [currSession, setCurrSession] = useState('')
  const [currCourse, setCurrCourse] = useState('')
  const [currBranch, setCurrBranch] = useState('')
  const [currSem, setCurrSem] = useState('')
  const [currBatch, setCurrBatch] = useState('')
  const [currCourseId, setCurrCourseId] = useState('')
  const [currBranchId, setCurrBranchId] = useState('')
  const [currComponent, setCurrComponent] = useState('')
  const router = useRouter()

  useEffect(() => {
    setComponents([])
    setOffers([])
    const settings = async () => {
      await axios
        .get(url + 'session_year')
        .then(res => {
          setYears(res.data)
          setCurrYear(res.data[0].session_year)
        })
        .catch(err => console.log(err))

      await axios
        .get(url + 'session')
        .then(res => {
          setSessions(res.data)
          setCurrSession(res.data[0].session)
        })
        .catch(err => console.log(err))

      await axios
        .get(url + 'course')
        .then(res => {
          setCourses(res.data)
          setCurrCourse(res.data[0].name)
          setSemesters(2 * parseInt(res.data[0].duration))
          setCurrCourseId(res.data[0].id)
          setCurrSem(1)
        })
        .catch(err => console.log(err))

      await axios
        .get(url + 'branch')
        .then(res => {
          setBranches(res.data)
          setCurrBranch(res.data[0].name)
          setCurrBranchId(res.data[0].id)
        })
        .catch(err => console.log(err))
    }
    settings()
  }, [])

  useEffect(() => {
    courses.forEach(el => {
      if (el.name === currCourse) {
        setSemesters(el.duration)
        setCurrCourseId(el.id)
      }
    })
  }, [currCourse])

  useEffect(() => {
    branches.forEach(el => {
      if (el.name === currBranch) {
        setCurrBranchId(el.id)
      }
    })
  }, [currBranch])

  const handleSubmit = async () => {
    const data1 = {
      sem: currSem,
      course_id: currCourseId
    }
    await axios
      .post(url + 'filter', data1)
      .then(res => {
        setComponents(res.data)
      })
      .catch(err => console.log(err))

    const data2 = {
      session_year: currYear,
      session: currSession,
      course_id: currCourseId,
      branch_id: currBranchId,
      sem: currSem
    }
    await axios
      .post(url + 'getOffers', data2)
      .then(res => {
        setOffers(res.data)
      })
      .catch(err => console.log(err))
  }

  const components_total = {}
  if (components.length > 0) {
    components.forEach(el => {
      components_total[el.name] = []
    })
    components.forEach(el => {
      components_total[el.name].push(el)
    })
  }

  const components_done = {}
  const components_code = {}
  if (components.length > 0) {
    components.forEach(el => {
      components_done[el.name] = []
      components_code[el.name] = el.course_component
    })
    offers.forEach(el => {
      let b = false
      Object.keys(components_code).forEach(it => {
        let s = ''
        for (let i = 0; i < el.sub_category.length; i++) {
          if (el.sub_category[i] >= '0' && el.sub_category[i] <= 9) break
          s += el.sub_category[i]
        }
        if (b === false && components_code[it].includes(s) && components_done[it] < components_total[it]) {
          components_done[it].push(el)
          b = true
        }
      })
    })
  }

  const handleOffer = (e, el) => {
    router.push({
      pathname: '/courseoffer',
      query: {
        session_year: currYear,
        session: currSession,
        programme: currCourse,
        branch: currBranch,
        course_id: currCourseId,
        branch_id: currBranchId,
        sem: currSem,
        component_name: el.name,
        component_code: el.code,
        component_total: JSON.stringify(components_total[el.name]),
        component_done: JSON.stringify(components_done[el.name]),
        branches: JSON.stringify(branches)
      }
    })
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Course Details' />
          <CardContent>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='session_year_label'>Session Year</InputLabel>
                    <Select
                      labelId='session_year_label'
                      id='session_year'
                      value={currYear}
                      onChange={e => setCurrYear(e.target.value)}
                    >
                      {years.map((el, index) => (
                        <MenuItem key={index} value={el.session_year}>
                          {el.session_year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='sessions_label'>Session</InputLabel>
                    <Select
                      labelId='sessions_label'
                      id='sessions'
                      value={currSession}
                      onChange={e => setCurrSession(e.target.value)}
                    >
                      {sessions.map((el, index) => (
                        <MenuItem key={index} value={el.session}>
                          {el.session}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Other form elements */}
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='courses_label'>Course</InputLabel>
                    <Select
                      labelId='courses_label'
                      id='courses'
                      value={currCourse}
                      onChange={e => setCurrCourse(e.target.value)}
                    >
                      {courses.map((el, index) => (
                        <MenuItem key={index} value={el.name}>
                          {el.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='branches_label'>Branch</InputLabel>
                    <Select
                      labelId='branches_label'
                      id='branches'
                      value={currBranch}
                      onChange={e => setCurrBranch(e.target.value)}
                    >
                      {branches.map((el, index) => (
                        <MenuItem key={index} value={el.name}>
                          {el.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='sem_label'>Semester</InputLabel>
                    <Select labelId='sem_label' id='sem' value={currSem} onChange={e => setCurrSem(e.target.value)}>
                      {Array.from({ length: 2 * parseInt(semesters) }, (_, i) => (
                        <MenuItem key={i} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='batch_label'>Batch</InputLabel>
                    <Select
                      labelId='batch_label'
                      id='batch'
                      value={currBatch}
                      onChange={e => setCurrBatch(e.target.value)}
                    >
                      {years.map((el, index) => (
                        <MenuItem key={index} value={el.session_year}>
                          {el.session_year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button variant='contained' onClick={handleSubmit}>
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Component</TableCell>
                <TableCell>Component Count</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Offer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(components_total).map((el, index) => (
                <TableRow key={index}>
                  <TableCell>{el}</TableCell>
                  <TableCell>
                    {components_done[el].length}/{components_total[el].length}
                  </TableCell>
                  <TableCell>{currCourseId}</TableCell>
                  <TableCell>{currBranchId}</TableCell>
                  <TableCell>{currSem}</TableCell>
                  <TableCell>
                    <Button
                      variant='contained'
                      onClick={e =>
                        handleOffer(e, {
                          name: el,
                          code: components_code[el]
                        })
                      }
                    >
                      Offer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default Course
