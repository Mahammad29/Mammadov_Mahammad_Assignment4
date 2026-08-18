import { useEffect, useState } from 'react'
import React from "react"
import logo from './assets/logo.svg'
import profile from './assets/profile.jpg'
import serviceOne from './assets/service-one.svg'
import serviceTwo from './assets/service-two.svg'
import serviceThree from './assets/service-three.svg'
import auth from './auth.js'
import {
  signup,
  signin,
  listResource,
  createResource,
  updateResource,
  deleteResource
} from './api.js'

/*
  Name: Mahammad Mammadov
  Course: COMP229 - Web Application Development
  Assignment: Assignment 4 - Testing and Deployment
*/

function App() {
  const [page, setPage] = useState('home')
  const [session, setSession] = useState(auth.isAuthenticated())

  function openPage(pageName) {
    setPage(pageName)
  }

  function handleSignedIn(data) {
    auth.authenticate(data)
    setSession(data)
    setPage(data.user.role === 'Admin' ? 'admin' : 'home')
  }

  async function handleSignout() {
    await auth.clearJWT()
    setSession(false)
    setPage('home')
  }

  const isAdmin = session && session.user && session.user.role === 'Admin'

  return (
    <div className="portfolio-page">
      <aside className="left-side">
        <img src={logo} alt="Custom MM logo" className="logo-image" />
      </aside>

      <div className="main-area">
        <div className="top-space"></div>
        <div className="teal-line"></div>

        <section className="content-box">
          <header className="header">
            <h1>My Portfolio</h1>

            <nav>
              <button onClick={() => openPage('home')}>Home</button>
              <button onClick={() => openPage('about')}>About</button>
              <button onClick={() => openPage('education')}>Education</button>
              <button onClick={() => openPage('projects')}>Project</button>
              <button onClick={() => openPage('services')}>Services</button>
              <button onClick={() => openPage('contact')}>Contact</button>

              {!session && (
                <>
                  <button onClick={() => openPage('signup')}>Sign Up</button>
                  <button onClick={() => openPage('signin')}>Sign In</button>
                </>
              )}

              {isAdmin && (
                <button onClick={() => openPage('admin')}>Admin</button>
              )}

              {session && (
                <button onClick={handleSignout}>Sign Out</button>
              )}
            </nav>

            {session && (
              <p className="signed-in-text">
                Signed in: {session.user.name} ({session.user.role})
              </p>
            )}
          </header>

          <hr />

          <main className="page-content">
            {page === 'home' && <Home openPage={openPage} />}
            {page === 'about' && <About />}
            {page === 'education' && <Education />}
            {page === 'projects' && <Projects />}
            {page === 'services' && <Services />}
            {page === 'contact' && <Contact />}
            {page === 'signup' && <Signup onSuccess={() => setPage('signin')} />}
            {page === 'signin' && <Signin onSignedIn={handleSignedIn} />}
            {page === 'admin' && (
              isAdmin
                ? <AdminDashboard session={session} />
                : <MessageBox message="Admin access is required." />
            )}
          </main>
        </section>

        <footer className="footer">
          <p>Assignment 4</p>
          <p>Web Application Development</p>
          <p>COMP229</p>
        </footer>
      </div>
    </div>
  )
}

function Home({ openPage }) {
  return (
    <div className="home">
      <h2>Hello World!</h2>
      <p>
        Welcome to my full stack portfolio website. My name is Mahammad Mammadov,
        and I am a Software Engineering Technician student.
      </p>
      <p>
        This application uses React on the frontend and Node, Express and MongoDB
        on the backend.
      </p>
      <p>
        Assignment 4 CI/CD deployment update completed successfully.
      </p>
      <button className="main-button" onClick={() => openPage('about')}>
        Go to About Me
      </button>
    </div>
  )
}

function About() {
  return (
    <div>
      <h2>About Me</h2>
      <div className="about-box">
        <img src={profile} alt="Mahammad Mammadov" className="profile" loading="lazy" decoding="async" />
        <div>
          <h3>Mahammad Mammadov</h3>
          <p>
            My legal name is Mahammad Mammadov. I am a Software Engineering
            student in Canada. I am learning React, JavaScript, HTML, CSS, Java,
            Python, C# and database systems.
          </p>
          <p>
            I am working on full stack web applications and learning how the
            frontend communicates with backend APIs and MongoDB.
          </p>
          <a href="/resume.pdf" target="_blank" className="resume-link">
            Open Resume PDF
          </a>
        </div>
      </div>
    </div>
  )
}

function Education() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    listResource('qualifications')
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h2>Education / Qualifications</h2>
      {error && <p className="error-text">{error}</p>}
      {items.length === 0 && !error && <p>No qualifications found in the database.</p>}
      {items.map((item) => (
        <div className="info-card" key={item._id}>
          <h3>{item.title}</h3>
          <p><strong>Name:</strong> {item.firstname} {item.lastname}</p>
          <p><strong>Email:</strong> {item.email}</p>
          <p><strong>Completion:</strong> {formatDate(item.completion)}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}

function Projects() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    listResource('projects')
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h2>Projects</h2>
      {error && <p className="error-text">{error}</p>}
      {items.length === 0 && !error && <p>No projects found in the database.</p>}
      <div className="grid">
        {items.map((project) => (
          <div className="project-card" key={project._id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p><strong>Completed:</strong> {formatDate(project.completion)}</p>
            <p><strong>Created by:</strong> {project.firstname} {project.lastname}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Services() {
  const services = [
    {
      title: 'Web Development',
      image: serviceOne,
      text: 'Creating simple websites with HTML, CSS, JavaScript, React and backend APIs.'
    },
    {
      title: 'Programming',
      image: serviceTwo,
      text: 'Writing beginner-level programs using Java, Python and C#.'
    },
    {
      title: 'App Planning',
      image: serviceThree,
      text: 'Planning app pages, user features and basic software requirements.'
    }
  ]

  return (
    <div>
      <h2>Services</h2>
      <div className="grid">
        {services.map((service) => (
          <div className="project-card" key={service.title}>
            <img src={service.image} alt={service.title} loading="lazy" decoding="async" />
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Contact() {
  const emptyForm = {
    firstname: '',
    lastname: '',
    contactNumber: '',
    email: '',
    message: ''
  }
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('')

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('')
    try {
      await createResource('contacts', form)
      setStatus('Thank you. Your information was saved to MongoDB.')
      setForm(emptyForm)
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <div>
      <h2>Contact Me</h2>
      <div className="contact-layout">
        <div className="contact-panel">
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> Mahammad Mammadov</p>
          <p><strong>Email:</strong> mm.mehemmed.memmedov.1998@gmail.com</p>
          <p><strong>Location:</strong> Toronto, Canada</p>
        </div>

        <form onSubmit={submit} className="contact-form">
          <label>First Name</label>
          <input name="firstname" value={form.firstname} onChange={change} required />

          <label>Last Name</label>
          <input name="lastname" value={form.lastname} onChange={change} required />

          <label>Contact Number</label>
          <input name="contactNumber" type="tel" value={form.contactNumber} onChange={change} required />

          <label>Email Address</label>
          <input name="email" type="email" value={form.email} onChange={change} required />

          <label>Message</label>
          <textarea name="message" rows="4" value={form.message} onChange={change} required></textarea>

          <button type="submit" className="main-button">Send Message</button>
          {status && <p className="status-text">{status}</p>}
        </form>
      </div>
    </div>
  )
}

function Signup({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState('')

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('')
    try {
      await signup(form)
      setStatus('New account successfully created. You can sign in now.')
      setTimeout(onSuccess, 700)
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <SimpleForm title="Sign Up" onSubmit={submit} status={status}>
      <label>Name</label>
      <input name="name" value={form.name} onChange={change} required />
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={change} required />
      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={change} minLength="6" required />
    </SimpleForm>
  )
}

function Signin({ onSignedIn }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('')
    try {
      const data = await signin(form)
      onSignedIn(data)
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <SimpleForm title="Sign In" onSubmit={submit} status={status}>
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={change} required />
      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={change} required />
    </SimpleForm>
  )
}

function SimpleForm({ title, onSubmit, status, children }) {
  return (
    <div className="simple-form-box">
      <h2>{title}</h2>
      <form className="contact-form" onSubmit={onSubmit}>
        {children}
        <button className="main-button" type="submit">Submit</button>
        {status && <p className="status-text">{status}</p>}
      </form>
    </div>
  )
}

function AdminDashboard({ session }) {
  const [tab, setTab] = useState('projects')

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Admin can create, read, update and delete portfolio data.</p>
      <div className="admin-tabs">
        <button onClick={() => setTab('projects')}>Projects</button>
        <button onClick={() => setTab('qualifications')}>Qualifications</button>
        <button onClick={() => setTab('contacts')}>Contacts</button>
        <button onClick={() => setTab('users')}>Users</button>
      </div>

      {tab === 'projects' && (
        <AdminResource
          resource="projects"
          title="Projects"
          token={session.token}
          fields={projectFields}
        />
      )}

      {tab === 'qualifications' && (
        <AdminResource
          resource="qualifications"
          title="Qualifications"
          token={session.token}
          fields={qualificationFields}
        />
      )}

      {tab === 'contacts' && (
        <AdminContacts token={session.token} />
      )}

      {tab === 'users' && <UsersReadOnly />}
    </div>
  )
}

const projectFields = [
  ['title', 'Title', 'text'],
  ['firstname', 'First Name', 'text'],
  ['lastname', 'Last Name', 'text'],
  ['email', 'Email', 'email'],
  ['completion', 'Completion Date', 'date'],
  ['description', 'Description', 'textarea']
]

const qualificationFields = [
  ['title', 'Title', 'text'],
  ['firstname', 'First Name', 'text'],
  ['lastname', 'Last Name', 'text'],
  ['email', 'Email', 'email'],
  ['completion', 'Completion Date', 'date'],
  ['description', 'Description', 'textarea']
]

function AdminResource({ resource, title, token, fields }) {
  const empty = Object.fromEntries(fields.map(([name]) => [name, '']))
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState('')
  const [status, setStatus] = useState('')

  async function refresh() {
    try {
      setItems(await listResource(resource))
    } catch (err) {
      setStatus(err.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [resource])

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('')
    try {
      if (editingId) {
        await updateResource(resource, editingId, form, token)
        setStatus(`${title} item updated.`)
      } else {
        await createResource(resource, form, token)
        setStatus(`${title} item created.`)
      }
      setForm(empty)
      setEditingId('')
      await refresh()
    } catch (err) {
      setStatus(err.message)
    }
  }

  function edit(item) {
    const values = {}
    fields.forEach(([name, , type]) => {
      values[name] = type === 'date' ? dateInput(item[name]) : (item[name] || '')
    })
    setForm(values)
    setEditingId(item._id)
  }

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return
    try {
      await deleteResource(resource, id, token)
      setStatus('Item deleted.')
      await refresh()
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <div className="admin-section">
      <h3>{title} CRUD</h3>
      <form className="admin-form" onSubmit={submit}>
        {fields.map(([name, label, type]) => (
          <label key={name}>
            {label}
            {type === 'textarea' ? (
              <textarea name={name} value={form[name]} onChange={change} required />
            ) : (
              <input name={name} type={type} value={form[name]} onChange={change} required />
            )}
          </label>
        ))}
        <div>
          <button type="submit" className="main-button">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setEditingId('')
                setForm(empty)
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {status && <p className="status-text">{status}</p>}

      <div className="admin-list">
        {items.map((item) => (
          <div className="admin-row" key={item._id}>
            <div>
              <strong>{item.title}</strong>
              <div>{item.description}</div>
            </div>
            <div className="row-buttons">
              <button onClick={() => edit(item)}>Edit</button>
              <button onClick={() => remove(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminContacts({ token }) {
  const emptyForm = {
    firstname: '',
    lastname: '',
    email: '',
    contactNumber: '',
    message: ''
  }
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [status, setStatus] = useState('')

  async function refresh() {
    try {
      setItems(await listResource('contacts'))
    } catch (err) {
      setStatus(err.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('')
    try {
      if (editingId) {
        await updateResource('contacts', editingId, form, token)
        setStatus('Contact updated.')
      } else {
        await createResource('contacts', form, token)
        setStatus('Contact created.')
      }
      setForm(emptyForm)
      setEditingId('')
      await refresh()
    } catch (err) {
      setStatus(err.message)
    }
  }

  function edit(item) {
    setForm({
      firstname: item.firstname || '',
      lastname: item.lastname || '',
      email: item.email || '',
      contactNumber: item.contactNumber || '',
      message: item.message || ''
    })
    setEditingId(item._id)
  }

  async function remove(id) {
    if (!window.confirm('Delete this contact?')) return
    try {
      await deleteResource('contacts', id, token)
      setStatus('Contact deleted.')
      await refresh()
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <div className="admin-section">
      <h3>Contacts CRUD</h3>
      <form className="admin-form" onSubmit={submit}>
        <label>
          First Name
          <input name="firstname" value={form.firstname} onChange={change} required />
        </label>
        <label>
          Last Name
          <input name="lastname" value={form.lastname} onChange={change} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={change} required />
        </label>
        <label>
          Contact Number
          <input name="contactNumber" value={form.contactNumber} onChange={change} required />
        </label>
        <label>
          Message
          <textarea name="message" value={form.message} onChange={change} required />
        </label>
        <div>
          <button type="submit" className="main-button">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setEditingId('')
                setForm(emptyForm)
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {status && <p className="status-text">{status}</p>}
      <div className="admin-list">
        {items.map((item) => (
          <div className="admin-row" key={item._id}>
            <div>
              <strong>{item.firstname} {item.lastname}</strong>
              <div>{item.email} {item.contactNumber && `| ${item.contactNumber}`}</div>
              <div>{item.message}</div>
            </div>
            <div className="row-buttons">
              <button onClick={() => edit(item)}>Edit</button>
              <button onClick={() => remove(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersReadOnly() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    listResource('users')
      .then(setItems)
      .catch((err) => setStatus(err.message))
  }, [])

  return (
    <div className="admin-section">
      <h3>Users</h3>
      {status && <p className="status-text">{status}</p>}
      <div className="admin-list">
        {items.map((item) => (
          <div className="admin-row" key={item._id}>
            <div>
              <strong>{item.name}</strong>
              <div>{item.email}</div>
            </div>
            <span className="role-badge">{item.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MessageBox({ message }) {
  return <div className="info-card">{message}</div>
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

function dateInput(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export default App
