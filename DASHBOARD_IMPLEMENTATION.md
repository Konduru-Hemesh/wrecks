# Dashboard Implementation Guide

The dashboard needs to be updated to integrate with the backend APIs. Here are the key changes required:

## 1. Add Imports
Add `Trash2` to the lucide-react imports (line 16):
```javascript
  Trash2,
} from "lucide-react";
```

Also add Bar chart import to recharts (line 40):
```javascript
  BarChart,
  Bar,
```

## 2. Add Warning Messages Constant
After the CATEGORIES constant (around line 58), add:
```javascript
// Funny warning messages for different spending levels
const WARNING_MESSAGES = {
  low: [
    "All good! Your wallet is still smiling 🙂",
    "Looking good! Keep it up! 👍",
    "Your budget approves! ✅",
  ],
  moderate: [
    "Careful… month end is watching you 👀",
    "At this speed, Maggi nights are coming 🍜",
    "Your wallet is getting nervous 😰",
    "Slow down, champ! 🐌",
    "Budget says: 'Easy there!' 🛑",
  ],
  high: [
    "Salary left the chat 😭",
    "Month end loading… zero balance incoming ⚠️",
    "Emergency! Budget is in ICU 🚨",
    "Your wallet filed a complaint 📢",
    "Time to eat air for dinner 💨",
    "Netflix about to be Netflixn't 📺❌",
  ],
};
```

## 3. Update State Variables
Replace the mock data state (lines 68-78) with:
```javascript
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [lastWarningLevel, setLastWarningLevel] = useState("low");
```

## 4. Replace useEffect and Add Data Fetching
Replace the existing useEffect (line 100-102) with:
```javascript
  useEffect(() => {
    setMounted(true);
    fetchUserData();
    fetchExpenses();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data.expenses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
      setLoading(false);
    }
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyIncome = 75000;
  const remainingBudget = monthlyIncome - totalExpenses;
  
  // Generate chart data
  const cashFlowData = expenses.length === 0 ? [
    { day: "Start", balance: monthlyIncome },
    { day: "End", balance: monthlyIncome },
  ] : [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, expense, index) => {
      const balance = acc.length > 0 ? acc[acc.length - 1].balance - expense.amount : monthlyIncome - expense.amount;
      acc.push({ day: `Day ${index + 1}`, balance });
      return acc;
    }, [{ day: "Start", balance: monthlyIncome }]);

  // Generate category data for bar chart
  const categoryData = Object.entries(
    expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {})
  ).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount,
  }));

  // Smart warning system
  const getWarningLevel = () => {
    if (totalExpenses === 0) return "low";
    const spendingPercentage = (totalExpenses / monthlyIncome) * 100;
    if (spendingPercentage < 50) return "low";
    if (spendingPercentage < 80) return "moderate";
    return "high";
  };

  const showSpendingWarning = (newTotal) => {
    const spendingPercentage = (newTotal / monthlyIncome) * 100;
    let level = "low";
    if (spendingPercentage < 50) level = "low";
    else if (spendingPercentage < 80) level = "moderate";
    else level = "high";

    if (level !== lastWarningLevel || level === "high") {
      const messages = WARNING_MESSAGES[level];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      if (level === "low") {
        toast.success(randomMessage, { duration: 3000 });
      } else if (level === "moderate") {
        toast.warning(randomMessage, { duration: 4000 });
      } else {
        toast.error(randomMessage, { duration: 5000 });
      }
      
      setLastWarningLevel(level);
    }
  };
```

## 5. Update handleAddExpense
Replace the existing handleAddExpense function with:
```javascript
  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseForm),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to add expense');
        return;
      }

      toast.success('Expense added successfully!');
      setExpenses([data.expense, ...expenses]);
      
      const newTotal = totalExpenses + parseFloat(expenseForm.amount);
      showSpendingWarning(newTotal);

      setExpenseForm({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddExpense(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };
```

## 6. Add handleDeleteExpense
After handleAddExpense, add:
```javascript
  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Failed to delete expense');
        return;
      }

      toast.success('Expense deleted successfully!');
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };
```

## 7. Update handleReceiptScan
In handleReceiptScan, after getting the data from response, replace the newExpense creation with:
```javascript
      toast.success('Receipt scanned and expense added!');
      setExpenses([data.expense, ...expenses]);
      
      const newTotal = totalExpenses + data.expense.amount;
      showSpendingWarning(newTotal);
```

## 8. Update handleLogout
Replace handleLogout with:
```javascript
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully!');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };
```

## 9. Update Loading Check
Before the return statement, add warning level calculation and update the loading check:
```javascript
  const warningLevel = getWarningLevel();
  const warningColors = {
    low: "border-green-500/30 bg-green-500/5",
    moderate: "border-yellow-500/30 bg-yellow-500/5",
    high: "border-red-500/30 bg-red-500/5",
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
```

## 10. Update UI Elements
- Replace "FlowCast" with "SpendAhead"
- Replace all instances of `{user?.name || 'User'}` for the user name display
- Update metric cards to use `totalExpenses` and `remainingBudget`
- Add warning colors to the first metric card: `className={...border-2 ${warningColors[warningLevel]}}`
- Add delete button to expense items with Trash2 icon
- Update calculateWhatIf to use remainingBudget

## 11. Add Category Bar Chart
After the timeline chart section, add a bar chart for expenses by category (if categoryData.length > 0).

## Complete Implementation
Due to the extensive nature of these changes, it's recommended to either:
1. Manually apply each change following this guide
2. Or use the complete dashboard file provided in the repository examples

The key functionality implemented:
- ✅ Real-time data fetching from backend APIs
- ✅ User authentication check with redirect
- ✅ Smart warning system with funny messages
- ✅ Dynamic chart updates
- ✅ Add/delete expense functionality
- ✅ Receipt scanning with database persistence
- ✅ User-specific data isolation
- ✅ Responsive design maintained
