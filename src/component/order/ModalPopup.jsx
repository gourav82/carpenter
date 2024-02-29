import { _getItemsById } from '@/network/items'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Modal from 'react-responsive-modal'

const ModalPopup = ({onCloseModal,openModel, order}) => {
    
  useEffect(()=>{

    if(order) {
      _getItemsById(order.orderId).then((res)=>{
        console.log({res});
      }).catch((err) => {
        console.log({err});
      })
    }
    
  }, [order])
  return (
<Modal open={openModel} onClose={onCloseModal} center>
        <h2>Name:- Madan Gopal</h2>

        <div className="modal flex flex--justify-content-between flex--align-items-center">
        <Image src="/assets/images/logo.png" width={150} height={200} alt='' className='mt--10' />
        <span>
          <span className="color--maroon font--bold">Window</span>
          <span className="flex flex--justify-content-between flex--align-items-center">
            <span>Length <span>(In)</span>:</span>
            <span> 400</span>
          </span>
          <span className="flex flex--justify-content-between flex--align-items-center">
            <span>Length <span>(In)</span>: </span>
            <span> 400</span>
          </span>
          <span className="flex flex--justify-content-between flex--align-items-center">
            <span>Length <span>(In)</span>: </span>
            <span> 400</span>
          </span>
        </span>
        </div>
      </Modal>
    )
}

export default ModalPopup