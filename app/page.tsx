import { ExpenseOverview } from "./_components/expense-overview";
import { ExpenseList } from "./_components/expense-list";
import { AddExpenseButton } from "./_components/add-expense-button";

export default function HomePage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expense Tracker</h1>
            <p className="text-muted-foreground">
              Track and analyze your spending
            </p>
          </div>
          <AddExpenseButton />
        </div>
        <ExpenseOverview />
        <ExpenseList />
      </div>
    </main>
  );
}
