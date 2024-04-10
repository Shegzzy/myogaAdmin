import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
// import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
//import ListIcon from '@mui/icons-material/List';
import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { collection, onSnapshot, doc, getDoc, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

//import ProfileModal from "../modal/ProfileModal";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  //const navigate = useNavigate();
  //const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        const userRef = doc(db, "Admin", currentUser.uid);
        const docs = await getDoc(userRef);
        if (docs.exists) {
          setUser(docs.data());
        } else {
          alert("No such document!");
        }
      }
    };

    fetchUser();
  });

  useEffect(() => {
    // Fetch the data from Firestore      if (currentUser) {
    const fetchData = async () => {
      //Listening to Database
      const unsub = onSnapshot(
        collection(db, "Drivers"),
        (snapShot) => {
          const data = snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const filtered = data.filter((driver) => {
            const name = driver.FullName?.toLowerCase() ?? "";
            return name.includes(searchTerm?.toLowerCase() ?? "");
          });
          setItems(data);
          setFilteredItems(filtered);
          // console.log(filtered);
        },
        (error) => {
          console.log(error);
        }
      );

      return () => {
        unsub();
      };

      // Clean up the listener when the component unmounts
    };

    fetchData();
  }, [searchTerm]);

  const handleSearch = () => {
    const filtered = items.filter((driver) => {
      const name = driver.FullName?.toLowerCase() ?? "";
      return name.includes(searchTerm?.toLowerCase() ?? "");
    });
    setFilteredItems(filtered);
  };

  return (
    <div className="mNavbar">
      <div className="wrapper">
        {/* <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch();
            }}
          />

          <SearchIcon style={{ cursor: "pointer" }} />
          {searchTerm !== "" && filteredItems.length > 0 && (
            <div className="dropdown">
              {filteredItems.map((driver) => (
                <Link
                  key={driver.id}
                  to={`/users/${driver.id}`}
                  className="dropdown-item"
                >
                  {driver.FullName}
                </Link>
              ))}
            </div>
          )}
        </div> */}
        <h4> {user && user.role ? (
          <h4>{user.role}</h4>
        ) : (
          <p>Loading...</p>
        )}</h4>

        <div className="items">
          <div className="item">
            <LanguageIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>

          {/* <div className="item">
                        <FullscreenExitIcon className="icon" />
                    </div>
                    <div className="item">
                        <NotificationsNoneIcon className="icon" />
                        <div className="counter">1</div>
                    </div>
                    <div className="item">
                        <ChatBubbleOutlineIcon className="icon" />
                        <div className="counter">2</div>
                    </div> */}
          <div
            className="item"
            onClick={() => navigate("/profile", { replace: true })}
          >
            <img
              src={
                user
                  ? user.profilePhoto
                  : "https://cdn-icons-png.flaticon.com/512/3033/3033143.png"
              }
              alt="cottonbro studio from Pexels"
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
