import React, { useState, useRef, useEffect } from "react";
import "./HeaderComponent.css";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useNavigate } from "react-router-dom";
import type { IUserResponse } from "../../types/IUser";

export const HeaderComponent = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node | null)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const { user }= React.useContext(AuthenticationContext) as { user: IUserResponse; refreshUser: () => void };

	return (
		<div className="top-bar">
			<div className="top-bar-content">
				<div className="top-bar-content-right" ref={dropdownRef}>
					<div className="user-info" onClick={toggleDropdown}>
						{user?.avatar ? (
							<img className="avatar-small" src={user.avatar} alt="User Avatar" />
						) : (
							<svg className="avatar-small" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
								<path
									fill="#000000"
									d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M2.75 12a9.25 9.25 0 1 1 16.282 6.01a4.84 4.84 0 0 0-1.17-2.034c-.782-.813-1.76-1.286-2.608-1.55c-.626-.195-1.216.03-1.604.293c-.36.242-.94.531-1.65.531s-1.29-.29-1.65-.531c-.388-.262-.978-.488-1.604-.293c-.849.264-1.826.737-2.608 1.55a4.84 4.84 0 0 0-1.17 2.033A9.2 9.2 0 0 1 2.75 12m3.513 7.256c.076-1.011.46-1.724.957-2.241c.553-.576 1.28-.941 1.972-1.157a.2.2 0 0 1 .103.003a.7.7 0 0 1 .216.101c.501.338 1.374.788 2.489.788s1.988-.45 2.489-.788a.7.7 0 0 1 .216-.1a.2.2 0 0 1 .103-.004c.692.216 1.419.581 1.972 1.157c.497.517.88 1.23.957 2.241A9.2 9.2 0 0 1 12 21.25a9.2 9.2 0 0 1-5.737-1.994M9.75 10c0-1.25.97-2.25 2.25-2.25s2.25 1 2.25 2.25s-.97 2.25-2.25 2.25s-2.25-1-2.25-2.25M12 6.25A3.72 3.72 0 0 0 8.25 10A3.72 3.72 0 0 0 12 13.75A3.72 3.72 0 0 0 15.75 10A3.72 3.72 0 0 0 12 6.25"
								/>
							</svg>
						)}
						<span className="username">{user?.fullName}</span>
						<svg
							className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
							width="16"
							height="16"
							fill="#000000"
							version="1.1"
							id="Capa_1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 30.727 30.727"
						>
							<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
							<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								{" "}
								<g>
									{" "}
									<path
										d="M29.994,10.183L15.363,24.812L0.733,10.184c-0.977-0.978-0.977-2.561,0-3.536c0.977-0.977,2.559-0.976,3.536,0 l11.095,11.093L26.461,6.647c0.977-0.976,2.559-0.976,3.535,0C30.971,7.624,30.971,9.206,29.994,10.183z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									></path>{" "}
								</g>{" "}
							</g>
						</svg>
					</div>

					{isDropdownOpen && (
						<div className="dropdown-menu">
							<div className="dropdown-item user-profile" onClick={() => navigate("/account")}>
								{user?.avatar ? (
									<img className="avatar-small" src={user.avatar} alt="User Avatar" />
								) : (
									<svg
										className="avatar-small"
										xmlns="http://www.w3.org/2000/svg"
										width="200"
										height="200"
										viewBox="0 0 24 24"
									>
										<path
											fill="#000000"
											d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M2.75 12a9.25 9.25 0 1 1 16.282 6.01a4.84 4.84 0 0 0-1.17-2.034c-.782-.813-1.76-1.286-2.608-1.55c-.626-.195-1.216.03-1.604.293c-.36.242-.94.531-1.65.531s-1.29-.29-1.65-.531c-.388-.262-.978-.488-1.604-.293c-.849.264-1.826.737-2.608 1.55a4.84 4.84 0 0 0-1.17 2.033A9.2 9.2 0 0 1 2.75 12m3.513 7.256c.076-1.011.46-1.724.957-2.241c.553-.576 1.28-.941 1.972-1.157a.2.2 0 0 1 .103.003a.7.7 0 0 1 .216.101c.501.338 1.374.788 2.489.788s1.988-.45 2.489-.788a.7.7 0 0 1 .216-.1a.2.2 0 0 1 .103-.004c.692.216 1.419.581 1.972 1.157c.497.517.88 1.23.957 2.241A9.2 9.2 0 0 1 12 21.25a9.2 9.2 0 0 1-5.737-1.994M9.75 10c0-1.25.97-2.25 2.25-2.25s2.25 1 2.25 2.25s-.97 2.25-2.25 2.25s-2.25-1-2.25-2.25M12 6.25A3.72 3.72 0 0 0 8.25 10A3.72 3.72 0 0 0 12 13.75A3.72 3.72 0 0 0 15.75 10A3.72 3.72 0 0 0 12 6.25"
										/>
									</svg>
								)}
								<div className="user-details">
									<div className="user-name">{user?.fullName}</div>
									<div className="user-email">{user?.email}</div>
								</div>
							</div>
							<div className="dropdown-divider"></div>
							<button className="dropdown-item dropdown-button" onClick={handleLogout}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
									<path
										d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
