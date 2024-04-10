import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useLocation } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useGoogleLoginMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const GoogleOneTabUtil = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();

  const handleGoogleSubmit = async (credentialResponse) => {
    try {
      const res = await googleLogin(credentialResponse).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      handleGoogleSubmit(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  if (googleLoading) {
    return <Loader />;
  }
};

export default GoogleOneTabUtil;
