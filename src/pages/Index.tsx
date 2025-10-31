import { useState, useEffect } from "react";
import Login from "@/components/modern/Login";
import Navbar from "@/components/modern/Navbar";
import Home from "@/components/modern/Home";
import AddFruit from "@/components/modern/AddFruit";
import ViewFruits from "@/components/modern/ViewFruits";
import Payment from "@/components/modern/Payment";

const Index = () => {
  // Load data from localStorage or use defaults
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [page, setPage] = useState(() => loadFromStorage("fruitApp_page", "login"));
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadFromStorage("fruitApp_isLoggedIn", false));

  // Login
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Shops (Companies)
  const [shops, setShops] = useState(() => loadFromStorage("fruitApp_shops", ["TTC", "FreshMart"]));
  const [newShop, setNewShop] = useState("");

  // Fruits list (for dropdown in AddFruit)
  const [fruitNames, setFruitNames] = useState(() => 
    loadFromStorage("fruitApp_fruitNames", ["Apple", "Banana", "Mango", "Orange"])
  );
  const [newFruitName, setNewFruitName] = useState("");

  // Fruits entries
  const [fruits, setFruits] = useState(() => loadFromStorage("fruitApp_fruits", []));
  const [form, setForm] = useState({
    shop: "",
    fruit: "",
    package: "",
    quantity: "",
    price: "",
    date: "",
  });

  // Edit fruit
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ package: "", quantity: "" });

  // Payment
  const [payment, setPayment] = useState({ shop: "", amount: "" });
  const [paidHistory, setPaidHistory] = useState(() => loadFromStorage("fruitApp_paidHistory", []));

  // Save to localStorage whenever important data changes
  useEffect(() => {
    localStorage.setItem("fruitApp_page", JSON.stringify(page));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("fruitApp_isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("fruitApp_shops", JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem("fruitApp_fruitNames", JSON.stringify(fruitNames));
  }, [fruitNames]);

  useEffect(() => {
    localStorage.setItem("fruitApp_fruits", JSON.stringify(fruits));
  }, [fruits]);

  useEffect(() => {
    localStorage.setItem("fruitApp_paidHistory", JSON.stringify(paidHistory));
  }, [paidHistory]);

  // Handle login
  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleLogin = () => {
    if (loginForm.username === "admin" && loginForm.password === "1234") {
      setIsLoggedIn(true);
      setPage("home");
      setLoginError("");
    } else {
      setLoginError("❌ Invalid username or password!");
    }
  };

  // Handle fruit form
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addFruit = () => {
    if (!form.shop || !form.fruit || !form.date) {
      alert("Shop, Fruit & Date are required");
      return;
    }
    setFruits([...fruits, form]);
    setForm({
      shop: "",
      fruit: "",
      package: "",
      quantity: "",
      price: "",
      date: "",
    });
  };

  const startUpdate = (i) => {
    setEditIndex(i);
    setEditForm({ package: fruits[i].package, quantity: fruits[i].quantity });
  };

  const confirmUpdate = (i) => {
    const updated = [...fruits];
    updated[i] = { ...updated[i], ...editForm };
    setFruits(updated);
    setEditIndex(null);
    setEditForm({ package: "", quantity: "" });
  };

  const cancelUpdate = () => {
    setEditIndex(null);
    setEditForm({ package: "", quantity: "" });
  };

  const deleteFruit = (i) => {
    const updated = [...fruits];
    updated.splice(i, 1);
    setFruits(updated);
  };

  // Totals
  const total = fruits.reduce((sum, f) => sum + Number(f.price || 0), 0);

  const shopTotals = fruits.reduce((acc, f) => {
    acc[f.shop] = (acc[f.shop] || 0) + Number(f.price || 0);
    return acc;
  }, {});

  const handlePaymentChange = (e) =>
    setPayment({ ...payment, [e.target.name]: e.target.value });

  const makePayment = () => {
    if (!payment.shop || !payment.amount) {
      alert("Please select a shop and enter amount");
      return;
    }

    const debits = paidHistory
      .filter((p) => p.shop === payment.shop)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const remaining = shopTotals[payment.shop] - debits;

    if (Number(payment.amount) > remaining) {
      alert(`❌ Cannot pay more than remaining balance (${remaining.toFixed(2)})`);
      return;
    }

    const newPayment = {
      shop: payment.shop,
      amount: Number(payment.amount),
      date: new Date().toLocaleDateString(),
    };

    setPaidHistory([...paidHistory, newPayment]);
    setPayment({ shop: "", amount: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {page === "login" && !isLoggedIn && (
        <Login
          loginForm={loginForm}
          handleLoginChange={handleLoginChange}
          handleLogin={handleLogin}
          loginError={loginError}
        />
      )}

      {isLoggedIn && (
        <>
          <Navbar setPage={setPage} setIsLoggedIn={setIsLoggedIn} />

          {page === "home" && (
            <Home
              shops={shops}
              setShops={setShops}
              newShop={newShop}
              setNewShop={setNewShop}
              fruitNames={fruitNames}
              setFruitNames={setFruitNames}
              newFruitName={newFruitName}
              setNewFruitName={setNewFruitName}
            />
          )}

          {page === "add" && (
            <AddFruit
              shops={shops}
              form={form}
              handleChange={handleChange}
              addFruit={addFruit}
              fruitNames={fruitNames}
            />
          )}

          {page === "view" && (
            <ViewFruits
              fruits={fruits}
              editIndex={editIndex}
              editForm={editForm}
              setEditForm={setEditForm}
              startUpdate={startUpdate}
              confirmUpdate={confirmUpdate}
              cancelUpdate={cancelUpdate}
              deleteFruit={deleteFruit}
              total={total}
              shopTotals={shopTotals}
              paidHistory={paidHistory}
            />
          )}

          {page === "pay" && (
            <Payment
              payment={payment}
              handlePaymentChange={handlePaymentChange}
              makePayment={makePayment}
              shopTotals={shopTotals}
              paidHistory={paidHistory}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
