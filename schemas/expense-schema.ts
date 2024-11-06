import * as z from 'zod'

export const expenseSchema = z.object({
    description: z.string().min(1, 'Description is required').max(255),
    amount: z.number().positive('Amount must be positive'),
    date: z.string(),
    category: z.enum(['Food', 'Transport', 'Entertainment'], {
        errorMap: () => ({ message: 'Invalid category' })
    })
})