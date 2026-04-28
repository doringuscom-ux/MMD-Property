import { useState, useEffect } from 'react';
import { Calculator, IndianRupee, Calendar, TrendingUp } from 'lucide-react';

const EMICalculator = ({ initialAmount = 5000000 }) => {
  const [loanAmount, setLoanAmount] = useState(initialAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    
    const emiValue = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalAmtValue = emiValue * n;
    const totalIntestValue = totalAmtValue - p;

    setEmi(emiValue);
    setTotalAmount(totalAmtValue);
    setTotalInterest(totalIntestValue);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">EMI Calculator</h3>
            <p className="text-slate-500 font-medium">Plan your home finance easily</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inputs */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-blue-600" /> Loan Amount
                </label>
                <span className="text-lg font-black text-blue-600">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Interest Rate
                </label>
                <span className="text-lg font-black text-emerald-500">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" /> Loan Tenure
                </label>
                <span className="text-lg font-black text-amber-500">{tenure} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-center">
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <div className="text-center pb-8 border-b border-white/10">
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3">Monthly EMI</p>
                <h4 className="text-5xl font-black text-white">{formatCurrency(emi)}</h4>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Interest</p>
                  <p className="text-xl font-black text-emerald-400">{formatCurrency(totalInterest)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Amount</p>
                  <p className="text-xl font-black text-blue-400">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EMICalculator;
