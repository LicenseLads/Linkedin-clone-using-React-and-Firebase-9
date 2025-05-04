import React, { useState } from "react";
import { RegisterAPI } from "../api/AuthAPI";
import { postUserData } from "../api/FirestoreAPI";

import { useNavigate } from "react-router-dom";
import { getUniqueID } from "../helpers/getUniqueId";
import "../Sass/LoginComponent.scss";
import { toast } from "react-toastify";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { FaArrowCircleLeft } from "react-icons/fa";

export default function RegisterComponent() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  let navigate = useNavigate();
  const [credentails, setCredentials] = useState({});
  const register = async () => {
    if (credentails?.accountType === undefined) {
      return toast.error("You need to select the account type.")
    }

    try {
      let res = await RegisterAPI(credentails.email, credentails.password);
      toast.success("Account Created!");
      postUserData({
        userID: getUniqueID(),
        name: credentails.name,
        email: credentails.email,
        imageLink:
          "https://storage.googleapis.com/meraki-photos/profile/default-user.webp",
        accountType: credentails?.accountType,
        country: country.name,
        state: state.name,
        city: city.name,
        about: credentails.about,
        company: credentails?.company,
        industry: credentails?.industry,
        college: credentails?.college,
        website: credentails?.website,
        skills: credentails?.skills,
      });
      navigate("/home");
      localStorage.setItem("userEmail", res.user.email);
    } catch (err) {
      console.log(err);
      toast.error("Cannot Create your Account");
    }
  };

  const validateFirstStep = () => {
    if (credentails.email === undefined)
      return {
        validated: false,
        message: "Cannot proceed to next step, no email provided.",
      };
    if (credentails.password === undefined)
      return {
        validated: false,
        message: "Cannot proceed to next step, no password provided.",
      };
    if (credentails.name === undefined)
      return {
        validated: false,
        message: "Cannot proceed to next step, no name provided.",
      };

    return { validated: true, message: null };
  };

  const validateSecondStep = () => {
    if (!country)
      return {
        validated: false,
        message: "Cannot proceed to next step, no country selected",
      };
    if (!state)
      return {
        validated: false,
        message: "Cannot proceed to next step, location configuration invalid.",
      };
    if (!city)
      return {
        validated: false,
        message: "Cannot proceed to next step, location configuration invalid.",
      };
    if (credentails.about === undefined || credentails.about === "")
      return {
        validated: false,
        message:
          "Cannot proceed to next step, about section must not be empty.",
      };

    return { validated: true, message: null };
  };

  const changeStep = () => {
    const validationObservation =
      step === 1 ? validateFirstStep() : validateSecondStep();
    if (!validationObservation.validated)
      return toast.error(validationObservation.message);
    return setStep(step + 1);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <input
            onChange={(event) =>
              setCredentials({ ...credentails, name: event.target.value })
            }
            value={credentails?.name}
            type="text"
            className="common-input"
            placeholder="Your Name"
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentails, email: event.target.value })
            }
            value={credentails?.email}
            type="email"
            className="common-input"
            placeholder="Email or phone number"
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentails, password: event.target.value })
            }
            value={credentails?.password}
            type="password"
            className="common-input"
            placeholder="Password (6 or more characters)"
          />
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <CountrySelect
            onChange={(e) => {
              setCountry(e);
              setState(null);
              setCity(null);
            }}
            placeHolder="Select Country"
            value={country}
            defaultValue={country}
          />
          <StateSelect
            countryid={country?.id ? country?.id : 0}
            onChange={(e) => {
              setState(e);
              setCity(null);
            }}
            placeHolder="Select State"
            disabled={!country || !country.hasStates}
            defaultValue={state}
          />
          <CitySelect
            countryid={country?.id ? country?.id : 0}
            stateid={state?.id ? state?.id : 0}
            onChange={(e) => {
              setCity(e);
            }}
            placeHolder="Select City"
            disabled={!state || !state.hasCities}
            defaultValue={city}
          />
          <textarea
            className="common-textarea"
            placeholder="Tell us more about yourself..."
            onChange={(event) => {
              setCredentials({ ...credentails, about: event.target.value });
            }}
          />
        </>
      );
    } else if (step === 3) {
      return (
        <>
          <input
            onChange={(event) =>
              setCredentials({ ...credentails, company: event.target.value })
            }
            value={credentails?.company}
            type="text"
            className="common-input"
            placeholder="Your company..."
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentails, industry: event.target.value })
            }
            value={credentails?.industry}
            type="text"
            className="common-input"
            placeholder="Your industry..."
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentails, college: event.target.value })
            }
            value={credentails?.college}
            type="text"
            className="common-input"
            placeholder="Your university..."
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentails, website: event.target.value })
            }
            value={credentails?.website}
            type="text"
            className="common-input"
            placeholder="Your website..."
          />
          <textarea
            onChange={(event) =>
              setCredentials({ ...credentails, skills: event.target.value })
            }
            value={credentails?.skills}
            type="text"
            className="common-textarea"
            placeholder="Your experience in a few words..."
          />

          <div className="account-type-row">
            <div className="account-type-checkbox-col">
              <label> Student </label>
              <input
                type="checkbox"
                checked={credentails?.accountType == "student"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCredentials({...credentails, accountType: "student"})
                  }
                }}
              />
            </div>
            <div className="account-type-checkbox-col">
              <label> Teacher </label>
              <input
                type="checkbox"
                checked={credentails?.accountType == "teacher"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCredentials({...credentails, accountType: "teacher"})
                  }
                }}
              />
            </div>
            <div className="account-type-checkbox-col">
              <label> Employer </label>
              <input
                type="checkbox"
                checked={credentails?.accountType == "employer"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCredentials({...credentails, accountType: "employer"})
                  }
                }}
              />
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="brand-logo">
        <span className="brand-text">Meraki</span>
      </div>
      
      <div className="login-wrapper-inner">
        <div className="title-row">
          {step !== 1 && (
            <FaArrowCircleLeft
              onClick={() => setStep(step - 1)}
              className="step-back-icon"
            />
          )}
          <h1 className="heading">Start your journey</h1>
        </div>

        <div className="auth-inputs">{renderStep()}</div>
        <button
          onClick={step === 3 ? register : () => changeStep()}
          className="login-btn"
        >
          {step === 3 ? "Join" : "Next"}
        </button>
      </div>
      <hr class="hr-text" data-content="or" />
      <div className="google-btn-container">
        <p className="go-to-signup">
          Already on Meraki?{" "}
          <span className="join-now" onClick={() => navigate("/")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
