import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { useNavigate } from 'react-router-dom';



import './NavLinks.css';

const NavLinks = props => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  return <ul className="nav-links">
    <li>
      <NavLink end to="/" >ALL USERS</NavLink>
    </li>
    {auth.isLoggedIn && (
      <li>
        <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
      </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <NavLink to="/places/new">ADD PLACE</NavLink>
      </li>
    )}
    {!auth.isLoggedIn && (
      <li>
        <NavLink to="/auth">AUTHENTICATE</NavLink>
      </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <button onClick={()=> {
          auth.logout();
          navigate('/auth');
        }}>LOGOUT</button>
      </li>
    )}


  </ul>
};

export default NavLinks;