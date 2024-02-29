import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { _getOrders } from "../../network/order";
import NewPassword from "../login/NewPassword";
import { _getEmployeeBulk } from "@/network/employee";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import ModalPopup from "./ModalPopup";

const Orders = () => {
  const {isMobile, isIpad } = useCheckMobileScreen();
  const [orders, setOrders] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openModel, setOpenModel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({})


  useEffect(() => {
    _getOrders(pageNumber, pageSize).then((res) => {
      const workerIds = res.data.orders.map((order) => {
        return order.workers
      }).reduce((acc, curr)=>{
        return [...acc, ...curr]
      }, []).map(worker => worker.workerId);


      _getEmployeeBulk([...new Set(workerIds)])
      .then(res => {
        return res.data.employees.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.uuid]: curr
          }
        }, {});
      })
      .then(employees => {
        console.log(employees);
        const orders = res.data.orders.map(order => {
          console.log(order);
          return {
            ...order,
            workers: order.workers.map(worker => { 
              return employees[worker.workerId] ? employees[worker.workerId] : []
            })
          }
        });

        setOrders(orders);
        setTotalOrders(res.data.totalCount);
        setTotalPages(Math.ceil(res.data.totalCount/pageSize));
      })
    });
  }, [pageNumber, pageSize])

  const handlePageChange = (e, newPage) => {
    console.log({e});
    setPageNumber(newPage);
  }

  const hanldleModel =(order)=>{
    setSelectedOrder(order);
    setOpenModel(true);
  }
  const onCloseModal = () =>{
    setOpenModel(false);
    }
  return (
    <>
      <div className="order container--responsive font--center">
        <div className="font--center position--relative fs--20">
          <input type="text" placeholder="search..." className="bg--shadow" />
          <BsSearch className="position--absolute search-icon" />
        </div>
        <div className={`order--card flex ${isMobile || isIpad ? "flex--direction-column": "flex--justify-content-between flex--align-items-center"} mt--30`}>
          {orders?.map((order, index) => (
            <>
              <div className="order--card-list bg--shadow bg--radius pd--15" key={`order-${index}`}>
                <span className="flex flex--justify-content-between flex--align-items-center">
                  <span className="color--maroon fs--22">
                    {order.customerName}
                  </span>
                  <span>
                    <button className="bg--success pl--15 pr--15 bg--radius color--white mr--10">
                    <Link href={`/orders/${order.orderId}`}>Edit</Link>
                    </button>
                    <button className="bg--maroon pl--15 pr--15 bg--radius color--white">
                      Delete
                    </button>
                  </span>
                </span>
                <div className="flex flex--justify-content-between flex--align-items-center">
                  <div className="mt--15">
                    <span className="flex flex--justify-content-between flex--align-items-center">
                      <span className="font--bold">Mobile No. :- </span>
                      <span>{order.phone}</span>
                    </span>
                    <span className="flex flex--justify-content-between mt--15">
                      <span className="font--bold">Address:- </span>
                      <span className="width--column-60 font--right">
                        {order.address}
                      </span>
                    </span>
                    <span className="flex flex--justify-content-between flex--align-items-center mt--10">
                      <span className="font--bold">Call Time:-</span>
                      <span>{order.visitTime}</span>
                    </span>
                    {order.workers.map((emp, index) => (
                      <>
                        <span className="flex flex--justify-content-between flex--align-items-center mt--10" key={`emp--${index}`}>
                          <span className="font--bold">Worker:-</span>
                          <span>{emp.name}</span>
                        </span>
                      </>
                    ))}

                    <span className="flex flex--justify-content-between flex--align-items-center mt--10">
                      <span className="font--bold">No. of Work:-</span>
                      <span>{order.items.length}</span>
                    </span>

                    <span className="flex flex--justify-content-between flex--align-items-center mt--10">
                      <span className="font--bold">Payment:-</span>
                      <span>{order.payment}</span>
                    </span>
                    <span className="flex flex--justify-content-between flex--align-items-center mt--10">
                      <span className="font--bold">Order No.:-</span>
                      <span>{order.orderId}</span>
                    </span>
                    <span className="flex flex--justify-content-between flex--align-items-center mt--10">
                      <span className="font--bold">Status:-</span>
                      <span>{order.status}</span>
                    </span>

                    <button className="bg--maroon bg--radius bg--shadow pt--5 pb--5 pl--10 pr--10 fs--15 width--column-30 color--white mt--10" onClick={hanldleModel(order)}> order Details</button>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>

        <div className="mb--30 mt--40 order--pagination">
          <Stack spacing={2}>
            <Pagination
              count={totalPages} 
              page={pageNumber} 
              onChange={handlePageChange}
              color="primary" 
            />
          </Stack>
        </div>

        <button className="bg--maroon bg--radius bg--shadow pd--10 fs--20 width--column-40 color--white mb--20">
          <Link href={`/orders/add`}>Add Order</Link>
        </button>
      </div>
      <ModalPopup onCloseModal={onCloseModal} openModel={openModel} order={selectedOrder}/>
    </>
  );
};

export default Orders;



