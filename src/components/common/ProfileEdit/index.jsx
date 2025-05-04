import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { editProfile } from "../../../api/FirestoreAPI";
import "./index.scss";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { toast } from "react-toastify";

export default function ProfileEdit({ onEdit, currentUser }) {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const [editInputs, setEditInputs] = useState(currentUser);
  const getInput = (event) => {
    let { name, value } = event.target;
    let input = { [name]: value };
    setEditInputs({ ...editInputs, ...input });
  };

  const updateProfileData = async () => {
    if (!country && !city && !state) editProfile(currentUser?.id, editInputs);
    else if (!city && !state) {
      return toast.error("Please select a valid location configuration!");
    }
    else editProfile(currentUser?.id, {
      ...editInputs,
      country: country?.name,
      state: state?.name,
      city: city?.name,
    });
    await onEdit();
  };

  return (
    <div className="profile-card-wrapper">
      <div className="profile-card">
        <div className="edit-btn">
          <AiOutlineClose className="close-icon" onClick={onEdit} size={25} />
        </div>

        <div className="profile-edit-inputs">
          <label>Nume</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Name"
            name="name"
            value={editInputs.name}
          />
          <CountrySelect
            onChange={(e) => {
              setCountry(e);
              setState(null);
              setCity(null);
            }}
            placeHolder="Selectează Țara"
            value={country}
            defaultValue={country}
          />
          <StateSelect
            countryid={country?.id ? country?.id : 0}
            onChange={(e) => {
              setState(e);
              setCity(null);
            }}
            placeHolder="Selectează Județul/Statul"
            disabled={!country || !country.hasStates}
          />
          <CitySelect
            countryid={country?.id ? country?.id : 0}
            stateid={state?.id ? state?.id : 0}
            onChange={(e) => {
              setCity(e);
            }}
            placeHolder="Selectează orașul"
            disabled={!state || !state.hasCities}
          />
          <label>Companie</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Company"
            value={editInputs.company}
            name="company"
          />
          <label>Industrie </label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Industry"
            name="industry"
            value={editInputs.industry}
          />
          <label>Colegiu</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="College"
            name="college"
            value={editInputs.college}
          />
          <label>Website</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Website"
            name="website"
            value={editInputs.website}
          />
          <label>Despre mine</label>
          <textarea
            placeholder="About Me"
            className="common-textarea"
            onChange={getInput}
            rows={5}
            name="about"
            value={editInputs.about}
          />
          <label>Abilitati</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Skill"
            name="skills"
            value={editInputs.skills}
          />
        </div>
        <div className="save-container">
          <button className="save-btn" onClick={updateProfileData}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
