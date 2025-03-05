import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

const CustomButton = ({
    label,
    variant = "primary",
    size = "md",
    icon,
    rounded = false,
    onClick,
    disabled = false,
    className = "",
    type
}) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.6)", // Glow effect
                borderRadius: rounded ? "50px" : "6px", // Matches button shape
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            style={{ display: "inline-block" }}
        >
            <Button
                variant={variant}
                size={size}
                onClick={onClick}
                disabled={disabled}
                className={`${rounded ? "rounded-pill" : ""} ${className}`}
                type={type}
                style={{
                    letterSpacing: "0.5px",
                    padding: "0.75rem 1.5rem",
                    textTransform: "capitalize",
                    transition: "all 0.3s ease-in-out",
                    border: "none",
                    outline: "none",
                    borderRadius: rounded ? "50px" : "6px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")} // Remove glow instantly
            >
                {icon && <span className="me-2">{icon}</span>}
                {label}
            </Button>
        </motion.div>
    );
};

export default CustomButton;