import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./SidebarComponent.css";

export const SidebarComponent = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <div className="sidebar-top">
                <div className="sidebar-top-wrapper">
                    <a className="redirect" href="/dashboard">
                        <img
                            src="https://bizweb.dktcdn.net/dev/admin/frontend/assets/sapo-logo-ncFhCziL.svg"
                            alt=""
                            className="sapo-logo"
                        />
                    </a>
                </div>
                <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
                    <svg
                        width="10px"
                        height="10px"
                        style={{
                            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                        }}
                        viewBox="-4.5 0 20 20"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {" "}
                            <title>arrow_left [#335]</title> <desc>Created with Sketch.</desc>{" "}
                            <defs> </defs>{" "}
                            <g
                                id="Page-1"
                                stroke="none"
                                stroke-width="1"
                                fill="none"
                                fill-rule="evenodd"
                            >
                                {" "}
                                <g
                                    id="Dribbble-Light-Preview"
                                    transform="translate(-345.000000, -6679.000000)"
                                    fill="#9e9e9e"
                                >
                                    {" "}
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        {" "}
                                        <path
                                            d="M299.633777,6519.29231 L299.633777,6519.29231 C299.228878,6518.90256 298.573377,6518.90256 298.169513,6519.29231 L289.606572,6527.55587 C288.797809,6528.33636 288.797809,6529.60253 289.606572,6530.38301 L298.231646,6538.70754 C298.632403,6539.09329 299.27962,6539.09828 299.685554,6538.71753 L299.685554,6538.71753 C300.100809,6538.32879 300.104951,6537.68821 299.696945,6537.29347 L291.802968,6529.67648 C291.398069,6529.28574 291.398069,6528.65315 291.802968,6528.26241 L299.633777,6520.70538 C300.038676,6520.31563 300.038676,6519.68305 299.633777,6519.29231"
                                            id="arrow_left-[#335]"
                                        >
                                            {" "}
                                        </path>{" "}
                                    </g>{" "}
                                </g>{" "}
                            </g>{" "}
                        </g>
                    </svg>
                </button>
            </div>

            <div className="sidebar-menu">
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className="sidebar-link" title="Dashboard">
                        <div className="menu-icon">
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="m21.477 9.085-7.413-6.1a3.26 3.26 0 0 0-4.128 0l-7.413 6.1a.75.75 0 1 0 .954 1.158l.773-.636v8.393a3.383 3.383 0 0 0 3.75 3.75h8a3.382 3.382 0 0 0 3.75-3.75v-8.393l.773.636a.75.75 0 0 0 .954-1.158m-7.727 11.165h-3.5v-3.75a1.75 1.75 0 0 1 3.5 0zm4.5-2.25c0 1.577-.673 2.25-2.25 2.25h-.75v-3.75a3.25 3.25 0 0 0-6.5 0v3.75h-.75c-1.577 0-2.25-.673-2.25-2.25v-9.626l5.139-4.226a1.755 1.755 0 0 1 2.222 0l5.139 4.226z"></path></svg>
                        </div>
                        <span className="menu-name">Tổng quan</span>
                    </NavLink>

                    <NavLink to="/products" className="sidebar-link" title="Product">
                        <div className="menu-icon">
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" stroke="currentColor" stroke-width="0.5" d="m21.24 6.62-8.832-4.474-.003-.002a1.38 1.38 0 0 0-1.25.012l-3.789 2.01a1 1 0 0 0-.088.047l-4.54 2.41a1.37 1.37 0 0 0-.738 1.219v8.316c0 .514.283.981.738 1.22l8.413 4.465.003.002a1.38 1.38 0 0 0 1.25.011l8.836-4.477c.47-.235.761-.706.761-1.231v-8.296c0-.525-.291-.997-.76-1.231Zm-9.543-3.426a.2.2 0 0 1 .184-.002l8.267 4.189-3.217 1.602-8.083-4.277zm-.5 17.347-7.911-4.2-.004-.001a.2.2 0 0 1-.11-.182v-7.787l8.025 4.184zm.592-8.998-7.981-4.162 3.79-2.012 8.042 4.256zm9.04 4.605a.2.2 0 0 1-.113.183l-8.348 4.23v-7.998l3.844-1.914v2.007a.586.586 0 0 0 1.171 0v-2.59l3.447-1.716z"></path></svg>
                        </div>
                        <span className="menu-name">Sản phẩm</span>
                    </NavLink>

                    <NavLink to="/purchase-order" className="sidebar-link" title="Purchase Order">
                        <div className="menu-icon">
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#ffffff" d="m17.371 18.587l-.656-.656q-.128-.13-.306-.13t-.307.13t-.129.304q0 .175.129.303l.86.86q.186.187.419.187q.232 0 .419-.187l2.098-2.067q.129-.13.139-.297q.01-.169-.139-.317q-.129-.129-.316-.129t-.317.13l-1.894 1.869ZM7.27 8.73h9.462q.213 0 .356-.143t.144-.357q0-.214-.519-.357q-.518-.143-.616-.143H7.27q-.213 0-.356.143q-.144.143-.144.357q0 .213.144.357t.356.143ZM18 22.115q-1.671 0-2.836-1.164T14 18.115q0-1.67 1.164-2.835T18 14.115q1.671 0 2.836 1.165T22 18.115q0 1.672-1.164 2.836Q19.67 22.115 18 22.115ZM4 20.721V5.615q0-.67.472-1.143Q4.944 4 5.615 4h12.77q.67 0 1.143.472q.472.472.472 1.143v5.945q-.244-.09-.485-.154q-.24-.064-.515-.1v-5.69q0-.231-.192-.424Q18.615 5 18.385 5H5.615q-.23 0-.423.192Q5 5.385 5 5.615V19.05h6.344q.068.41.176.802q.109.392.303.748q-.029.006-.06-.009q-.032-.014-.055-.037l-.82-.57q-.111-.072-.234-.072t-.235.073l-.877.607q-.111.073-.234.073t-.235-.073l-.877-.607q-.111-.073-.234-.073q-.124 0-.235.073l-.877.607q-.112.073-.235.073t-.234-.073l-.877-.607q-.112-.073-.235-.073t-.234.073l-.781.607q-.058.039-.254.13Zm3.27-4.452h4.209q.056-.275.138-.515q.083-.24.193-.485H7.27q-.214 0-.357.144t-.144.356q0 .214.144.357q.143.143.356.143Zm0-3.769h6.81q.49-.387 1.05-.645q.56-.259 1.197-.355H7.269q-.213 0-.356.143q-.144.144-.144.357t.144.357q.143.143.356.143ZM5 19.05V5v14.05Z" /></svg>                        </div>
                        <span className="menu-name">Đơn đặt hàng nhập</span>
                    </NavLink>

                    <NavLink
                        to="/goods-receipt"
                        className="sidebar-link"
                        title="Goods Receipt"
                    >
                        <div className="menu-icon">

                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="#ffffff"><g fill="none" stroke="#ffffff"><path d="M3 7c0-1.886 0-2.828.586-3.414C4.172 3 5.114 3 7 3h10c1.886 0 2.828 0 3.414.586C21 4.172 21 5.114 21 7v10c0 1.886 0 2.828-.586 3.414C19.828 21 18.886 21 17 21H7c-1.886 0-2.828 0-3.414-.586C3 19.828 3 18.886 3 17z" /><path d="M3 12c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C4.602 15 5.068 15 6 15h.675c.581 0 .872 0 1.104.134a.995.995 0 0 1 .164.118c.2.178.292.453.476 1.005l.125.375c.22.66.33.99.592 1.18c.262.188.61.188 1.306.188h3.117c.695 0 1.043 0 1.305-.189s.372-.518.592-1.178l.125-.376c.184-.552.276-.827.476-1.005a.99.99 0 0 1 .164-.118c.232-.134.523-.134 1.104-.134H18c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C21 13.398 21 12.932 21 12M9.5 10.5L12 13m0 0l2.5-2.5M12 13V6" /></g></svg>
                        </div>
                        <span className="menu-name">Nhập hàng</span>
                    </NavLink>

                    <NavLink to="/suppliers" className="sidebar-link" title="Supplier">
                        <div className="menu-icon">
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16" fill="#ffffff"><g fill="#ffffff"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h4a.5.5 0 1 0 0-1h-4a.5.5 0 0 1-.5-.5V7.207l5-5l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" /><path d="M16 12.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 1 0 1 0v-1h1a.5.5 0 1 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" /></g></svg>
                        </div>
                        <span className="menu-name">Nhà cung cấp</span>
                    </NavLink>

                    <NavLink to="/employees" className="sidebar-link" title="Employee">
                        <div className="menu-icon">
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 36 36" fill="#ffffff"><g id="clarityEmployeeLine0" fill="#ffffff"><path d="M16.43 16.69a7 7 0 1 1 7-7a7 7 0 0 1-7 7Zm0-11.92a5 5 0 1 0 5 5a5 5 0 0 0-5-5ZM22 17.9a25.41 25.41 0 0 0-16.12 1.67a4.06 4.06 0 0 0-2.31 3.68v5.95a1 1 0 1 0 2 0v-5.95a2 2 0 0 1 1.16-1.86a22.91 22.91 0 0 1 9.7-2.11a23.58 23.58 0 0 1 5.57.66Zm.14 9.51h6.14v1.4h-6.14z" /><path d="M33.17 21.47H28v2h4.17v8.37H18v-8.37h6.3v.42a1 1 0 0 0 2 0V20a1 1 0 0 0-2 0v1.47H17a1 1 0 0 0-1 1v10.37a1 1 0 0 0 1 1h16.17a1 1 0 0 0 1-1V22.47a1 1 0 0 0-1-1Z" /></g></svg>
                        </div>
                        <span className="menu-name">Nhân viên</span>
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};
