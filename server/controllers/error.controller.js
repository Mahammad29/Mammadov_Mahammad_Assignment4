function getErrorMessage(err) {
  if (err && err.code === 11000) {
    return 'Email already exists'
  }
  if (err && err.message) {
    return err.message
  }
  return 'Server error'
}

export default { getErrorMessage }
