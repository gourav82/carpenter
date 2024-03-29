import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { _addOrders, _getOrderById, _updateOrderById } from "../../network/order";
import { orderFormInputFields } from "./constants";
import Image from 'next/image'
import { _getOrderItemsById } from "@/network/item";

const AddOrder = () => {
  const router = useRouter();
  const [mode, setMode] = useState("Add");
  const [workerForm, setWorkerForm] = useState({
    customerName: "",
    phone: "",
    visitTime: new Date(Date.now() + 24 * 3600 * 1000),
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    worker: [],
    items: [],
  });

  const [workerErrorForm, setWorkerErrorForm] = useState({
    customerName: "",
    phone: "",
    visitTime: "",
    address: "",
    worker: "",
    items: "",
  });
  const [items, setItems] = useState([]);



  useEffect(() => {
    console.log({ router });
    if (router.query.orderId) {
      setMode("Edit");
      _getOrderById(router.query.orderId).then((res) => {
        const fullAddress = res.data.address.split(",");
        setWorkerForm((prevState) => {
          return {
            ...prevState,
            customerName: res?.data?.customerName,
            phone: res?.data?.phone,
            visitTime: res?.data?.visitTime,
            address: fullAddress[0],
            city: fullAddress[1],
            landmark: fullAddress[2],
            pincode: fullAddress[3],
            worker: [],
            items: [],
          };
        });
        _getOrderItemsById(res.data.orderId).then((res) => {
          console.log({res});
          setItems(res.data);
        })
        console.log({ res });
      });
    }
  }, [router]);

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!nameRegex.test(name)) {
      setWorkerErrorForm((prevState) => {
        return {
          ...prevState,
          name: "please enter your name",
        };
      });
    } else {
      setWorkerErrorForm((prevState) => {
        return {
          ...prevState,
          name: "",
        };
      });
    }
  };
  const validateMobile = (mobile) => {
    const mobileNumberRegex = /^[0-9]{10}$/;
    if (!mobileNumberRegex.test(mobile)) {
      setWorkerErrorForm((prevState) => {
        return {
          ...prevState,
          mobile: "please enter currect mobile no",
        };
      });
    } else {
      setWorkerErrorForm((prevState) => {
        return {
          ...prevState,
          mobile: " ",
        };
      });
    }
  };

  const _handleChange = (event, field) => {
    setWorkerForm((prevState) => {
      return {
        ...prevState,
        [field]:
          field === "visiTime"
            ? new Date(event.target.value)
            : event.target.value,
      };
    });
    if (event.target.value === "") {
      setWorkerErrorForm((prevState) => {
        return {
          ...prevState,
          [field]: "",
        };
      });
      return;
    }
    if (field === "customerName") {
      validateName(event.target.value);
    }
    if (field === "phone") {
      validateMobile(event.target.value);
    }
  };

  useEffect(() => {
console.log({items});
  }, [items])

  const addOrder = () => {
    const payload = {
      customerName: workerForm.customerName,
      visitTime: 1708426649000,
      phone: workerForm.phone,
      workers: [],
      items: [],
      address: `${workerForm.address}, ${workerForm.landmark}, ${workerForm.city}, ${workerForm.pincode}`,
    };

    _addOrders({ payload })
      .then((response) => {
        console.log("form data payload", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const editOrder = () => {
    const payload = {
      customerName: workerForm.customerName,
      visitTime: 1708426649000,
      phone: workerForm.phone,
      workers: [],
      items: [],
      address: `${workerForm.address}, ${workerForm.landmark}, ${workerForm.city}, ${workerForm.pincode}`,
    };

    _updateOrderById(router.query.orderId, payload)
      .then((response) => {
        console.log("form data payload", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if(mode==='Add') {
      addOrder()
    } else if(mode==='Edit') {
      editOrder();
    }
    
  };

  return (
    <>
      <div className="container--responsive flex flex--justify-content-center flex--align-items-center mt--100" style={{gap: '20px'}}>
        <div className="employee bg--shadow bg--radius font--center">
          <form
            className="flex flex--wrap flex--justify-content-between flex--align-items-center pd--20"
            onSubmit={handleSubmitOrder}
          >
            {orderFormInputFields.map((input, index) => (
              <>
                <div className="width--column-40" style={{ height: "64px" }}>
                  <input
                    type={input.type}
                    name={input.field}
                    placeholder={input.placeholder}
                    className="mt--15"
                    value={workerForm[input.field]}
                    onChange={(e) => _handleChange(e, input.field)}
                    key={input.field}
                  />
                  <p
                    className={`${
                      workerErrorForm[input.field] ? "" : "hide"
                    } color--error`}
                    style={{ fontSize: "10px" }}
                  >
                    {workerErrorForm[input.field]}
                  </p>
                </div>
              </>
            ))}
            <button
              type="submit"
              className="bg--maroon bg--radius pd--10 color--white width--column-one mt--10"
            >
              {mode} Order
            </button>
          </form>
        </div>
        <div>
        <h3>Item Details: </h3>
        <div className="work-items-con" style={{height: '400px', overflow: 'scroll', width: '300px', padding: '20px'}}>
          {items && items.map((item) => (
            <>
            <div className="modal flex flex--justify-content-between flex--align-items-center" style={{gap: '20px'}}>
                <img src={item.image} width={100} height={100} alt='' className='mt--10' />
                <span>
                <div className="color--maroon font--bold" style={{background: 'light-gray', padding: '5px', marginBottom: '40px', borderRadius: '20px', border: '2px solid red', alignItems: 'center'}}>{item.itemName}</div>
                  {item.properties.map((property) => (
                    <>
                    <div className="flex flex--justify-content-between flex--align-items-center">
                        <span>{property.key}:</span>
                        <span> {property.value}</span>
                    </div>
                    </>
                  ))}
                </span>
            </div>
            </>
          ))}
        </div>
        </div>
      </div>
    </>
  );
};

export default AddOrder;
