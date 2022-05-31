import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { StoreContext } from "./StoreContext";

const MainFilter = () => {
  const { filter, setFilter, categoryObject, open, setOpen } =
    useContext(StoreContext);
  const [companies, setCompanies] = useState({});

  const [display, setDisplay] = useState("none");
  //fetch list of companies to display on the filter
  const fetchCompanies = async () => {
    const getCompanies = await fetch("/get-companies");
    const companies = await getCompanies.json();

    if (companies.status === 200) {
      setCompanies(companies.data);
    }
  };

  //company fetch only required once on load
  useEffect(() => {
    fetchCompanies();
  }, []);
  return (
    <>
      <Button
        className="closebtn"
        onClick={(e) => {
          setOpen(!open);
          e.target.classList.toggle("change");
          open
            ? (document.getElementById("mySidenav").style.display = "none")
            : (document.getElementById("mySidenav").style.display = "block");
        }}
      >
        <div className="container">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
      </Button>
      <MainWrapper id="mySidenav" className="sidenav">
        <Filter>
          <FilterTitle>Body Location</FilterTitle>
          <Label>
            All
            <RadioWrapper>
              <Radio
                value="all"
                type="radio"
                name="bodyLocation"
                onChange={(e) => {
                  setFilter({ ...filter, body_location: "" });
                }}
              />
            </RadioWrapper>
          </Label>
          {categoryObject.bodyLocation.map((location) => (
            <Label key={location}>
              {location}
              <RadioWrapper>
                <Radio
                  value={location}
                  type="radio"
                  name="bodyLocation"
                  onChange={(e) => {
                    setFilter({ ...filter, body_location: e.target.value });
                  }}
                />
              </RadioWrapper>
            </Label>
          ))}
          <FilterTitle>Category</FilterTitle>
          <Label>
            All
            <RadioWrapper>
              <WideRadio
                value="all"
                type="radio"
                name="category"
                onChange={(e) => {
                  setFilter({ ...filter, category: "" });
                }}
              />
            </RadioWrapper>
          </Label>
          {categoryObject.category.map((category) => (
            <Label key={category}>
              {category}
              <RadioWrapper>
                <Radio
                  value={category}
                  type="radio"
                  name="category"
                  onChange={(e) => {
                    setFilter({ ...filter, category: e.target.value });
                  }}
                />
              </RadioWrapper>
            </Label>
          ))}

          <FilterTitle>Company</FilterTitle>
          <Label>
            All
            <RadioWrapper>
              <WideRadio
                name="company"
                value="all"
                type="radio"
                onChange={() => {
                  setFilter({
                    ...filter,
                    companyId: "",
                  });
                }}
              />
            </RadioWrapper>
          </Label>
          {Object.keys(companies).length > 0 &&
            companies.map((company) => (
              <Label key={company._id}>
                {company.name}
                <RadioWrapper>
                  <WideRadio
                    name="company"
                    value={company._id}
                    type="radio"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        companyId: e.target.value,
                      });
                    }}
                  />
                </RadioWrapper>
              </Label>
            ))}
        </Filter>
      </MainWrapper>
    </>
  );
};

const Label = styled.div`
  display: flex;
  position: relative;
`;

const Radio = styled.input`
  position: absolute;
  margin-left: 150px;
`;

const WideRadio = styled.input`
  position: relative;
  margin-left: 150px;
`;

const Filter = styled.div`
  position: absolute;
  display: block;
  overflow: auto;
  height: 100vh;
`;

const FilterTitle = styled.div`
  font-weight: bold;
  margin-top: 15px;
`;

const RadioWrapper = styled.div`
  position: absolute;
`;

const MainWrapper = styled.div`
  margin-top: 40px;
`;
const Button = styled.button`
  width: 50px;
  height: 50px;
  background-color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: "Open Sans";
  font-weight: 900;
  position: absolute;
  margin-top: -3px;

  cursor: pointer;
`;

export default MainFilter;
