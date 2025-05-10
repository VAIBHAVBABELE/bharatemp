import React, { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'
import Sidebar from './Component/AdminDashboardComponent/Sidebar'
import { jwtDecode } from 'jwt-decode'
import AdminDashboard from './Component/AdminDashboardComponent/AdminDashboard'

function Admin() {
    const navigate = useNavigate()

    useEffect(() => {
        try {
            const token = localStorage.getItem("token"); // Ensure correct key
            if (token) {
                const decoded = jwtDecode(token);
                const adminTags = ["SubAdmin","SuperAdmin"]
                if (decoded.role && !adminTags.includes(decoded.role)) {
                    navigate('/admin-login')
                }
            } else {
                navigate('/admin-login')
            }
        } catch (error) {
            navigate('/admin-login')
        }
    }, [])

    return (
        <>
            <div className='w-full h-auto flex'>
                <Sidebar />
                <AdminDashboard/>
            </div>
        </>
    )
}

export default Admin