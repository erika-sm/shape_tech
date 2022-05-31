import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import { StoreContext } from "../StoreContext";
import { CircularProgress } from "@mui/material";

const Details = () => {
  const [loading, setLoading] = useState(false);
  let monthArr = [];
  let yearArr = [];
  const currentYear = moment().format("YYYY");
  const { states, provinces, loggedInUser } = useContext(StoreContext);
  const [edit, setEdit] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [editDetails, setEditDetails] = useState({
    nameOnCard: "",
    creditCardNumber: "",
    creditExpYear: "",
    creditExpMonth: "",
    cvc: "",

    fullName: "",
    email: "",
    country: "CA",
    address: "",
    city: "",
    provState: "",
    postalZip: "",
  });

  useEffect(() => {
    if (loggedInUser.fullName) {
      setEditDetails({
        ...editDetails,

        nameOnCard: loggedInUser.nameOnCard,
        creditCardNumber: loggedInUser.creditCardNumber,
        creditExpYear: loggedInUser.creditExpYear,
        creditExpMonth: loggedInUser.creditExpMonth,
        cvc: loggedInUser.cvc,

        fullName: loggedInUser.fullName,
        email: loggedInUser.email,
        country: loggedInUser.country,
        address: loggedInUser.address,
        city: loggedInUser.city,
        provState: loggedInUser.provState,
        postalZip: loggedInUser.postalZip,
      });
    } else {
      {
        setEditDetails({
          ...editDetails,
          email: loggedInUser.email,
          nameOnCard: "",
          creditCardNumber: "",
          creditExpYear: "",
          creditExpMonth: "",
          cvc: "",

          fullName: "",

          country: "CA",
          address: "",
          city: "",
          provState: "",
          postalZip: "",
        });
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updateInfo = await fetch("/update-user", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editDetails),
    });

    if (updateInfo.status === 200) {
      setLoading(false);
      setEdit(false);
    } else {
      setLoading(false);
      setErrorMsg(updateInfo.message);
    }
  };
  for (let i = currentYear; i <= parseInt(currentYear) + 10; i++) {
    yearArr.push(i);
  }

  for (let i = 1; i <= 12; i++) {
    monthArr.push(i);
  }

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <OrderFlexBox className="row">
            <Payment className="col-50">
              <div>
                <h3>Full Name</h3>
                {edit || !loggedInUser.fullName ? (
                  <InputBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        fullName: e.target.value,
                      })
                    }
                    required
                    style={{ textAlign: "center" }}
                    value={editDetails.fullName}
                  />
                ) : (
                  <TextBox>{editDetails.fullName} </TextBox>
                )}
                <h3>Email</h3>
                {edit || !loggedInUser.fullName ? (
                  <InputBox
                    required
                    style={{ textAlign: "center" }}
                    disabled
                    value={editDetails.email}
                  />
                ) : (
                  <TextBox>{editDetails.email} </TextBox>
                )}
                <h3>Address</h3>
                {edit || !loggedInUser.fullName ? (
                  <InputBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        address: e.target.value,
                      })
                    }
                    required
                    style={{ textAlign: "center" }}
                    value={editDetails.address}
                  />
                ) : (
                  <TextBox>{editDetails.address} </TextBox>
                )}
                <h3>City</h3>
                {edit || !loggedInUser.fullName ? (
                  <InputBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        city: e.target.value,
                      })
                    }
                    required
                    style={{ textAlign: "center" }}
                    value={editDetails.city}
                  />
                ) : (
                  <TextBox>{editDetails.city} </TextBox>
                )}
                <h3>Country</h3>
                {edit || !loggedInUser.fullName ? (
                  <SelectBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        country: e.target.value,
                      })
                    }
                    required
                    style={{ textAlign: "center" }}
                    defaultValue={"default"}
                  >
                    <option value={"default"}>Select One</option>
                    <option>CA</option>
                    <option>US</option>
                  </SelectBox>
                ) : (
                  <TextBox>{editDetails.country} </TextBox>
                )}
                {editDetails.country === "CA" ? (
                  <>
                    <h3>Province</h3>
                    {edit || !loggedInUser.fullName ? (
                      <SelectBox
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            province: e.target.value,
                          })
                        }
                        style={{ textAlign: "center" }}
                        defaultValue={"default"}
                        required
                      >
                        <option disabled value={"default"}>
                          {" "}
                          Select One
                        </option>
                        {provinces.map((province) => (
                          <option>{province}</option>
                        ))}
                      </SelectBox>
                    ) : (
                      <TextBox>{editDetails.provState} </TextBox>
                    )}
                  </>
                ) : (
                  <>
                    <h3>State</h3>
                    {edit || !loggedInUser.fullName ? (
                      <SelectBox
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            provState: e.target.value,
                          })
                        }
                        required
                        style={{ textAlign: "center" }}
                        defaultValue={"default"}
                      >
                        <option disabled value={"default"}>
                          {" "}
                          Select One
                        </option>
                        {states.map((state) => (
                          <option>{state}</option>
                        ))}
                      </SelectBox>
                    ) : (
                      <TextBox>{editDetails.provState} </TextBox>
                    )}
                  </>
                )}
              </div>
            </Payment>
            <Address className="col-50">
              <div>
                <h3>Credit Card Number</h3>
                {edit || !loggedInUser.fullName ? (
                  <InputBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        creditCardNumber: e.target.value,
                      })
                    }
                    type="number"
                    required
                    style={{ textAlign: "center" }}
                    value={editDetails.creditCardNumber}
                  />
                ) : (
                  <TextBox>{editDetails.creditCardNumber} </TextBox>
                )}

                <h3>Exp Month</h3>
                {edit || !loggedInUser.fullName ? (
                  <SelectBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        creditExpMonth: e.target.value,
                      })
                    }
                    required
                    style={{ textAlign: "center" }}
                    defaultValue={"default"}
                  >
                    <option disabled required value={"default"}>
                      {" "}
                      Select One
                    </option>
                    {monthArr.map((month) => (
                      <option>{month}</option>
                    ))}
                  </SelectBox>
                ) : (
                  <TextBox>{editDetails.creditExpMonth} </TextBox>
                )}
                <h3>Exp Year</h3>
                {edit || !loggedInUser.fullName ? (
                  <SelectBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        creditExpYear: e.target.value,
                      })
                    }
                    required
                    style={{ textAlign: "center" }}
                    defaultValue={"default"}
                  >
                    <option disabled default value={"default"}>
                      {" "}
                      Select One
                    </option>
                    {yearArr.map((year) => (
                      <option>{year}</option>
                    ))}
                  </SelectBox>
                ) : (
                  <TextBox>{editDetails.creditExpYear} </TextBox>
                )}
                <h3>CVC</h3>
                {edit || !loggedInUser.fullName ? (
                  <InputBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        cvc: e.target.value,
                      })
                    }
                    min="100"
                    max="999"
                    type="number"
                    required
                    style={{ textAlign: "center" }}
                    value={editDetails.cvc}
                  />
                ) : (
                  <TextBox>{editDetails.cvc} </TextBox>
                )}
                <h3>Name On Card</h3>
                {edit || !loggedInUser.fullName ? (
                  <InputBox
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        nameOnCard: e.target.value,
                      })
                    }
                    required
                    style={{ textAlign: "center" }}
                    value={editDetails.nameOnCard}
                  />
                ) : (
                  <TextBox>{editDetails.nameOnCard} </TextBox>
                )}
              </div>
              {editDetails.country === "CA" ? (
                <>
                  <h3>Postal Code</h3>
                  {edit || !loggedInUser.fullName ? (
                    <InputBox
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          postalZip: e.target.value,
                        })
                      }
                      required
                      style={{ textAlign: "center" }}
                      value={editDetails.postalZip}
                    />
                  ) : (
                    <TextBox>{editDetails.postalZip}</TextBox>
                  )}
                </>
              ) : (
                <>
                  <h3>Zip Code</h3>
                  {edit || !loggedInUser.fullName ? (
                    <InputBox
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          postalZip: e.target.value,
                        })
                      }
                      required
                      type="number"
                      style={{ textAlign: "center" }}
                      value={editDetails.postalZip}
                    />
                  ) : (
                    <TextBox>{editDetails.postalZip}</TextBox>
                  )}
                </>
              )}
            </Address>
            {errorMsg && <div>{errorMsg}</div>}
            {edit === true ? (
              <ButtonsContainer>
                <button>Save</button>{" "}
                <button type="button" onClick={() => setEdit(false)}>
                  Cancel
                </button>{" "}
              </ButtonsContainer>
            ) : (
              edit === false && (
                <Button onClick={() => setEdit(true)}>Edit</Button>
              )
            )}

            {!loggedInUser.fullName && <Button>Save</Button>}
          </OrderFlexBox>
        </form>
      )}
    </>
  );
};

const Address = styled.div``;

const Payment = styled.div``;
const OrderFlexBox = styled.div``;

const TextBox = styled.div`
  margin-top: -10px;
  margin-bottom: 10px;
`;

const InputBox = styled.input`
  width: 150px;
`;

const SelectBox = styled.select`
  width: 150px;
`;

const Button = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 90%;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 88%;
`;

export default Details;
