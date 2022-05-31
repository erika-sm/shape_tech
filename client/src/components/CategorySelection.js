import React from "react";

import { Link } from "react-router-dom";
import styled from "styled-components";
import { IoIosFitness, IoMdBicycle, IoMdMedical } from "react-icons/io";
import { MdPets, MdVideogameAsset } from "react-icons/md";
import { FaIndustry } from "react-icons/fa";
import { BsFillCameraReelsFill } from "react-icons/bs";
//these are our icons in our category component//

const CategorySelection = () => {
  return (
    <>
      <Wrapper>
        <ul className="categories">
          <li className="categoriesList">
            <Link to="/category/Fitness" className="links">
              <IoIosFitness />
              &nbsp; Fitness
            </Link>
            <Link to="/category/Lifestyle" className="links">
              <IoMdBicycle /> &nbsp; Lifestyle
            </Link>
            <Link to="/category/Medical" className="links">
              <IoMdMedical /> &nbsp; Medical
            </Link>
            <Link to="/category/Entertainment" className="links">
              <BsFillCameraReelsFill /> &nbsp; Entertainment
            </Link>
            <Link to="/category/Pets and Animals" className="links">
              <MdPets /> &nbsp; Animals
            </Link>
            <Link to="/category/Industrial" className="links">
              <FaIndustry /> &nbsp; Industrial
            </Link>
            <Link to="/category/Gaming" className="links">
              <MdVideogameAsset /> &nbsp; Gaming
            </Link>
          </li>
        </ul>
      </Wrapper>
    </>
  );
};

export default CategorySelection;

const Wrapper = styled.div``;
