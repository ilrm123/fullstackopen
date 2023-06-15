import { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('secret')

    const [ login, result ] = useMutation(LOGIN)
    
    useEffect(() => {
        if ( result.data ) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('user-token', token)
        }
    }, [result.data]) // eslint-disable-line

    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    return (
        <div>
            <form onSubmit={submit}>
            <div>
                username <input
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default Login