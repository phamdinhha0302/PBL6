import React, { useState, useContext, useEffect } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { AuthContext } from "../context/Auth";

function Menu() {
  const { user, jwt } = useContext(AuthContext);

  const [menu, setMenu] = useState([
    {
      item: "Customer",
      permission: "Nhân Viên",
      name: "Người dùng",
    },
    {
      item: "Coupon",
      permission: "Nhân Viên",
      name: "Mã giảm giá",
    },
    {
      item: "Product",
      permission: "Nhân Viên",
      name: "Sản phẩm",
    },
    {
      item: "Sale",
      permission: "Nhân Viên",
      name: "Giảm giá",
    },
    {
      item: "Category",
      permission: "Nhân Viên",
      name: "Danh mục",
    },
    {
      item: "Order",
      permission: "Nhân Viên",
      name: "Đơn hàng",
    },
    {
      item: "ConfirmOrder",
      permission: "Nhân Viên",
      name: "Xác nhận đơn hàng",
    },
    {
      item: "Delivery",
      permission: "Nhân Viên",
      name: "Vận chuyển",
    },
    {
      item: "ConfirmDelivery",
      permission: "Nhân Viên",
      name: "Xác nhận vận chuyển",
    },
    {
      item: "CompletedOrder",
      permission: "Nhân Viên",
      name: "Hoàn thành đơn hàng",
    },
    {
      item: "CancelOrder",
      permission: "Nhân Viên",
      name: "Huỷ đơn hàng",
    },
    {
      item: "User",
      permission: "Admin",
      name: "Người dùng",
    },
    {
      item: "Permission",
      permission: "Admin",
      name: "Quyền",
    },
    // "Category", ,
    // "Permission",
    // "User",
    // "Order",
    // "ConfirmOrder",
    // "Delivery",
    // "ConfirmDelivery",
    // "CompletedOrder",
    // "CancelOrder"
  ]);
  let { pathname } = window.location;
  return (
    <div>
      {jwt && user ? (
        <aside className="left-sidebar" data-sidebarbg="skin6">
          <div className="scroll-sidebar" data-sidebarbg="skin6">
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="list-divider"></li>

                <li className="sidebar-item">
                  <ul
                    aria-expanded="false"
                    className="collapse  first-level base-level-line"
                  >
                    {menu &&
                      menu.map((item, index) => (
                        <li className="sidebar-item active" key={index}>
                          {item.permission === user.id_permission.permission ? (
                            <NavLink
                              to={"/" + item.item.toLowerCase()}
                              className="sidebar-link"
                            >
                              {item.name}
                            </NavLink>
                          ) : (
                            <div></div>
                          )}
                        </li>
                      ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
}

export default Menu;
