import React from 'react';
import {loginStyles} from "../assets/dummyStyles.js";
import {Link} from "react-router-dom";
import {ArrowBigDown, ArrowLeft, LogIn} from "lucide-react";


const Login = () => {
    return (
        <div className={loginStyles.pageContainer}>
            <div className={loginStyles.bubble1}></div>
            <div className={loginStyles.bubble2}></div>

            <Link to='/' className={loginStyles.backButton}>
                <ArrowLeft className={loginStyles.backButtonIcon} />
                <span className={loginStyles.backButtonText}>Back</span>
            </Link>

            <div className={loginStyles.formContainer}>
                <form  className={loginStyles.form} noValidate>
                    <div className={loginStyles.formWrapper}>
                        <div className={loginStyles.animatedBorder}>
                            <div className={loginStyles.formContent}>
                                <h2 className={loginStyles.heading}>
                                    <span className={loginStyles.headingIcon}>
                                        <LogIn className={loginStyles.headingIconInner} />
                                    </span>
                                    <span className={loginStyles.headingText}>Login</span>
                                </h2>

                                <p className={loginStyles.subtitle}>
                                    Sign In to Continue to Quiz Application.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
