import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import PrivateRoutes from "./components/PrivateRoutes";
import ExpensesDashboard from "./components/ExpensesDashboard";
import AccountTable from "./components/AccountTable";
import Transfer from "./components/Transfer";

function App() {
    return (

            <BrowserRouter>
                <Routes>

                    <Route element={<PrivateRoutes />}>
                        <Route path="/welcome/" element={<Welcome />} >
                            <Route path="expenses" element={<ExpensesDashboard/>} />
                            <Route path="accounts" element={<AccountTable/>} />
                            <Route path="transfer" element={<Transfer/>} />
                        </Route>

                    </Route>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                </Routes>
            </BrowserRouter>
    );
}

export default App;
