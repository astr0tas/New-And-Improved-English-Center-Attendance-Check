import { createContext } from 'react';

const UserContext = createContext({user: null, position: ""});

export default UserContext;