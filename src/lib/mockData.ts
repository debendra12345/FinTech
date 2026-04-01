import type { Transaction } from '@/types';
import { generateId } from '@/lib/utils';
import { subDays, subMonths, format } from 'date-fns';

function d(daysAgo: number): string {
  return format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss");
}
function dm(monthsAgo: number, day: number): string {
  const base = subMonths(new Date(), monthsAgo);
  base.setDate(day);
  return format(base, "yyyy-MM-dd'T'HH:mm:ss");
}

export const mockTransactions: Transaction[] = [
  // Current month
  { id: generateId(), date: d(1), description: 'Monthly Salary', amount: 5800, type: 'income', category: 'salary', merchant: 'Acme Corp' },
  { id: generateId(), date: d(1), description: 'Freelance – UI Design', amount: 1200, type: 'income', category: 'freelance', merchant: 'Client A' },
  { id: generateId(), date: d(2), description: 'Apartment Rent', amount: 1450, type: 'expense', category: 'housing', merchant: 'City Apartments' },
  { id: generateId(), date: d(2), description: 'Grocery Run – Whole Foods', amount: 183.40, type: 'expense', category: 'food', merchant: 'Whole Foods' },
  { id: generateId(), date: d(3), description: 'Netflix Subscription', amount: 15.99, type: 'expense', category: 'entertainment', merchant: 'Netflix' },
  { id: generateId(), date: d(3), description: 'Uber Ride Downtown', amount: 24.50, type: 'expense', category: 'transport', merchant: 'Uber' },
  { id: generateId(), date: d(4), description: 'Electricity Bill', amount: 94.20, type: 'expense', category: 'utilities', merchant: 'City Power' },
  { id: generateId(), date: d(5), description: 'Investment – ETF Purchase', amount: 500, type: 'income', category: 'investment', merchant: 'Vanguard' },
  { id: generateId(), date: d(5), description: 'Restaurant Dinner', amount: 76.80, type: 'expense', category: 'food', merchant: 'Nobu NYC' },
  { id: generateId(), date: d(6), description: 'Amazon – Gadgets', amount: 249.99, type: 'expense', category: 'shopping', merchant: 'Amazon' },
  { id: generateId(), date: d(7), description: 'Doctor Visit', amount: 120, type: 'expense', category: 'healthcare', merchant: 'City Clinic' },
  { id: generateId(), date: d(8), description: 'Spotify Premium', amount: 9.99, type: 'expense', category: 'entertainment', merchant: 'Spotify' },
  { id: generateId(), date: d(9), description: 'Gas Station', amount: 58.30, type: 'expense', category: 'transport', merchant: 'Shell' },
  { id: generateId(), date: d(10), description: 'Online Course – Udemy', amount: 29.99, type: 'expense', category: 'education', merchant: 'Udemy' },
  { id: generateId(), date: d(11), description: 'Coffee Shop', amount: 32.50, type: 'expense', category: 'food', merchant: 'Blue Bottle Coffee' },
  { id: generateId(), date: d(12), description: 'Flight – NYC to LA', amount: 320, type: 'expense', category: 'travel', merchant: 'Delta Airlines' },
  { id: generateId(), date: d(14), description: 'Gym Membership', amount: 45, type: 'expense', category: 'healthcare', merchant: 'Equinox' },
  { id: generateId(), date: d(15), description: 'Side Project Revenue', amount: 850, type: 'income', category: 'freelance', merchant: 'Client B' },
  { id: generateId(), date: d(16), description: 'Internet Bill', amount: 79.99, type: 'expense', category: 'utilities', merchant: 'Comcast' },
  { id: generateId(), date: d(17), description: 'Zara – Clothing', amount: 134.00, type: 'expense', category: 'shopping', merchant: 'Zara' },
  // Last month
  { id: generateId(), date: dm(1, 1), description: 'Monthly Salary', amount: 5800, type: 'income', category: 'salary', merchant: 'Acme Corp' },
  { id: generateId(), date: dm(1, 2), description: 'Apartment Rent', amount: 1450, type: 'expense', category: 'housing', merchant: 'City Apartments' },
  { id: generateId(), date: dm(1, 3), description: 'Grocery Shopping', amount: 210.60, type: 'expense', category: 'food', merchant: 'Trader Joe\'s' },
  { id: generateId(), date: dm(1, 4), description: 'Dividend Income', amount: 320, type: 'income', category: 'investment', merchant: 'Fidelity' },
  { id: generateId(), date: dm(1, 5), description: 'Electricity Bill', amount: 88.40, type: 'expense', category: 'utilities', merchant: 'City Power' },
  { id: generateId(), date: dm(1, 7), description: 'Netflix + Disney+', amount: 25.98, type: 'expense', category: 'entertainment', merchant: 'Streaming' },
  { id: generateId(), date: dm(1, 10), description: 'Subway Pass', amount: 127, type: 'expense', category: 'transport', merchant: 'MTA' },
  { id: generateId(), date: dm(1, 12), description: 'Restaurant Lunch', amount: 48.90, type: 'expense', category: 'food', merchant: 'Shake Shack' },
  { id: generateId(), date: dm(1, 15), description: 'Freelance – Logo Design', amount: 600, type: 'income', category: 'freelance', merchant: 'Client C' },
  { id: generateId(), date: dm(1, 18), description: 'Apple Store – Accessories', amount: 89.99, type: 'expense', category: 'shopping', merchant: 'Apple' },
  { id: generateId(), date: dm(1, 20), description: 'Pharmacy', amount: 42.30, type: 'expense', category: 'healthcare', merchant: 'CVS' },
  { id: generateId(), date: dm(1, 22), description: 'Hotel Stay', amount: 280, type: 'expense', category: 'travel', merchant: 'Marriott' },
  { id: generateId(), date: dm(1, 25), description: 'Book Club', amount: 24.99, type: 'expense', category: 'education', merchant: 'Book of the Month' },
  // 2 months ago
  { id: generateId(), date: dm(2, 1), description: 'Monthly Salary', amount: 5800, type: 'income', category: 'salary', merchant: 'Acme Corp' },
  { id: generateId(), date: dm(2, 2), description: 'Apartment Rent', amount: 1450, type: 'expense', category: 'housing', merchant: 'City Apartments' },
  { id: generateId(), date: dm(2, 3), description: 'Groceries', amount: 195.20, type: 'expense', category: 'food', merchant: 'Whole Foods' },
  { id: generateId(), date: dm(2, 5), description: 'Stock Dividend', amount: 415, type: 'income', category: 'investment', merchant: 'Robinhood' },
  { id: generateId(), date: dm(2, 8), description: 'Transportation', amount: 98, type: 'expense', category: 'transport', merchant: 'Lyft' },
  { id: generateId(), date: dm(2, 10), description: 'Movie Night', amount: 36.50, type: 'expense', category: 'entertainment', merchant: 'AMC Theaters' },
  { id: generateId(), date: dm(2, 12), description: 'Gas & Electric', amount: 112.60, type: 'expense', category: 'utilities', merchant: 'ConEd' },
  { id: generateId(), date: dm(2, 15), description: 'Freelance Project', amount: 1500, type: 'income', category: 'freelance', merchant: 'Client D' },
  { id: generateId(), date: dm(2, 18), description: 'New Shoes', amount: 159.99, type: 'expense', category: 'shopping', merchant: 'Nike' },
  { id: generateId(), date: dm(2, 20), description: 'Dental Checkup', amount: 180, type: 'expense', category: 'healthcare', merchant: 'Smile Dental' },
  // 3 months ago
  { id: generateId(), date: dm(3, 1), description: 'Monthly Salary', amount: 5800, type: 'income', category: 'salary', merchant: 'Acme Corp' },
  { id: generateId(), date: dm(3, 2), description: 'Apartment Rent', amount: 1450, type: 'expense', category: 'housing', merchant: 'City Apartments' },
  { id: generateId(), date: dm(3, 5), description: 'Investment Returns', amount: 890, type: 'income', category: 'investment', merchant: 'Vanguard' },
  { id: generateId(), date: dm(3, 8), description: 'Food & Groceries', amount: 230.40, type: 'expense', category: 'food', merchant: 'Costco' },
  { id: generateId(), date: dm(3, 10), description: 'Car Insurance', amount: 145, type: 'expense', category: 'transport', merchant: 'Geico' },
  { id: generateId(), date: dm(3, 12), description: 'Internet + Phone', amount: 130, type: 'expense', category: 'utilities', merchant: 'Verizon' },
  { id: generateId(), date: dm(3, 15), description: 'Weekend Trip', amount: 450, type: 'expense', category: 'travel', merchant: 'Airbnb' },
  { id: generateId(), date: dm(3, 18), description: 'Concert Tickets', amount: 175, type: 'expense', category: 'entertainment', merchant: 'Ticketmaster' },
  { id: generateId(), date: dm(3, 20), description: 'Coursework – Coursera', amount: 49, type: 'expense', category: 'education', merchant: 'Coursera' },
  // 4 months ago
  { id: generateId(), date: dm(4, 1), description: 'Monthly Salary', amount: 5800, type: 'income', category: 'salary', merchant: 'Acme Corp' },
  { id: generateId(), date: dm(4, 2), description: 'Apartment Rent', amount: 1450, type: 'expense', category: 'housing', merchant: 'City Apartments' },
  { id: generateId(), date: dm(4, 5), description: 'Dividend Check', amount: 280, type: 'income', category: 'investment', merchant: 'Fidelity' },
  { id: generateId(), date: dm(4, 8), description: 'Grocery Shopping', amount: 178.90, type: 'expense', category: 'food', merchant: 'Safeway' },
  { id: generateId(), date: dm(4, 10), description: 'Taxi/Rideshare', amount: 67.20, type: 'expense', category: 'transport', merchant: 'Lyft' },
  { id: generateId(), date: dm(4, 12), description: 'Electric Bill', amount: 102.30, type: 'expense', category: 'utilities', merchant: 'City Power' },
  { id: generateId(), date: dm(4, 15), description: 'Freelance Income', amount: 950, type: 'income', category: 'freelance', merchant: 'Client E' },
  { id: generateId(), date: dm(4, 18), description: 'Shopping Spree', amount: 320, type: 'expense', category: 'shopping', merchant: 'Nordstrom' },
  // 5 months ago
  { id: generateId(), date: dm(5, 1), description: 'Monthly Salary', amount: 5800, type: 'income', category: 'salary', merchant: 'Acme Corp' },
  { id: generateId(), date: dm(5, 2), description: 'Apartment Rent', amount: 1450, type: 'expense', category: 'housing', merchant: 'City Apartments' },
  { id: generateId(), date: dm(5, 5), description: 'Investment Gains', amount: 650, type: 'income', category: 'investment', merchant: 'Schwab' },
  { id: generateId(), date: dm(5, 8), description: 'Groceries & Snacks', amount: 155.70, type: 'expense', category: 'food', merchant: 'Trader Joe\'s' },
  { id: generateId(), date: dm(5, 10), description: 'Monthly Transit Pass', amount: 127, type: 'expense', category: 'transport', merchant: 'MTA' },
  { id: generateId(), date: dm(5, 12), description: 'Streaming Services', amount: 48.97, type: 'expense', category: 'entertainment', merchant: 'Multiple' },
  { id: generateId(), date: dm(5, 15), description: 'Phone Bill', amount: 85, type: 'expense', category: 'utilities', merchant: 'AT&T' },
];
