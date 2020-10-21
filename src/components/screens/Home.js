import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  // console.log(state,"before-home")
  useEffect(() => {
    fetch("https://cors-anywhere.herokuapp.com/https://instapost562.herokuapp.com/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);
  const likePost = (id) => {
    fetch("https://cors-anywhere.herokuapp.com/https://instapost562.herokuapp.com/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "like");
        const newData = data.map((item) => {
          if (item._id === result._id) {
            item.likes = result.likes;
            return item;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("https://cors-anywhere.herokuapp.com/https://instapost562.herokuapp.com/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            item.likes = result.likes;
            return item;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("https://cors-anywhere.herokuapp.com/https://instapost562.herokuapp.com/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id.toString() === result._id.toString()) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`https://cors-anywhere.herokuapp.com/https://instapost562.herokuapp.com/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            {item.postedBy !== null && (
              <h5>
                <Link
                  to={
                    item.postedBy._id !== null &&
                    item.postedBy._id !== state._id
                      ? `/profile/${item.postedBy._id}`
                      : "/profile"
                  }
                >
                  {item.postedBy !== null ? item.postedBy.name : "sai"}{" "}
                </Link>
                {item.postedBy._id !== null && item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{ float: "right" }}
                    onClick={() => deletePost(item._id)} //delete icon display here
                  >
                    delete_forever{" "}
                  </i>
                )}
              </h5>
            )}
            {/* <h5>
                  {
                    console.log(state)
                    
                  }
              <Link to={item.postedBy._id&&item.postedBy._id !==state._id?"/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name} </Link>
                {item.postedBy._id&&item.postedBy._id ===state._id && <i  className ="material-icons" style={{float:"right"}}
                 onClick={()=>deletePost(item._id)}                                         //delete icon display here
                 >delete_forever </i>
                 }
                </h5>
                 */}

            <div className="card-image">
              <img src={item.photo} alt={item.photo} />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  style={{ color: "red" }}
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  favorite{" "}
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  favorite_border{" "}
                </i>
              )}

              <h6>{item.likes.length} likes</h6>
              <h5>{item.title}</h5>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  record.postedBy !== null && (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name && record.postedBy.name !== null
                          ? record.postedBy.name
                          : "0"}{" "}
                      </span>{" "}
                      {record.text}{" "}
                    </h6>
                  )
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
