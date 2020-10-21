import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>{" "}
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">CreatePost</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">following post</Link>
        </li>,

        <li key="5">
          <button
            className="logout btn "
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signup">Signup</Link>
        </li>,
        <li key="7">
          <Link to="/signin">Login</Link>
        </li>,
      ];
    }
  };
  const fetchUsers = (query) => {
    setSearch(query);
    fetch("https://cors-anywhere.herokuapp.com/https://instapost562.herokuapp.com/serach-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserDetails(result.user);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instapost
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search user"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <div className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== null && item._id  !== state._id
                      ? "/profile/" + item._id
                      : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <a  className="collection-item"> {item.email}</a>{" "}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
