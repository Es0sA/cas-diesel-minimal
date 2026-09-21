import re

with open('src/components/RegisterPage.jsx', 'r') as f:
    content = f.read()

# 1. Add API import
content = content.replace("import { DEPOT_PRICES } from '../data/depots';", "import { DEPOT_PRICES } from '../data/depots';\nimport { api } from '../api';")

# 2. Add state variables for Driver
driver_state = '''  const [driverEmail, setDriverEmail] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverConfirmPassword, setDriverConfirmPassword] = useState('');
  const [driverError, setDriverError] = useState('');
'''
content = content.replace("  const [driverName, setDriverName] = useState('');", driver_state + "  const [driverName, setDriverName] = useState('');")

# 3. Add state variables for Buyer
buyer_state = '''  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [buyerConfirmPassword, setBuyerConfirmPassword] = useState('');
  const [buyerError, setBuyerError] = useState('');
'''
content = content.replace("  const [buyerCompany, setBuyerCompany] = useState('');", buyer_state + "  const [buyerCompany, setBuyerCompany] = useState('');")

# 4. Add state variables for Supplier
supplier_state = '''  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierPassword, setSupplierPassword] = useState('');
  const [supplierConfirmPassword, setSupplierConfirmPassword] = useState('');
  const [supplierError, setSupplierError] = useState('');
'''
content = content.replace("  const [supplierName, setSupplierName] = useState('');", supplier_state + "  const [supplierName, setSupplierName] = useState('');")

# 5. Modify handleDriverSubmit
handle_driver_submit = '''  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    setDriverError('');
    if (driverPassword.length < 12) {
      setDriverError('Password must be at least 12 characters.');
      return;
    }
    if (driverPassword !== driverConfirmPassword) {
      setDriverError('Passwords do not match.');
      return;
    }
    if (!verifiedSupplier) {
      setCodeError('You must enter a valid marketer authorization code to register as a driver.');
      return;
    }
    
    try {
      await api.auth.register({ email: driverEmail, password: driverPassword, role: 'DRIVER' });
      await api.auth.login({ email: driverEmail, password: driverPassword });
      
      const [firstName, ...lastNames] = driverName.split(' ');
      await api.drivers.updateProfile({
        firstName: firstName || 'Unknown',
        lastName: lastNames.join(' ') || 'Driver',
        licenseNumber: driverLicense,
        truckPlateNumber: driverPlate,
        truckCapacityLiters: driverCapacity
      });

      // Mark code as redeemed
      const updatedInvites = invites.map(inv => {
        if (inv.code === verifiedSupplier.code) {
          return {
            ...inv,
            status: 'used',
            usedBy: `${driverName} (${driverPlate})`
          };
        }
        return inv;
      });

      setInvites(updatedInvites);
      localStorage.setItem('cas_invites_store', JSON.stringify(updatedInvites));

      setSubmitSuccess({
        role: 'driver',
        title: 'Driver Registration Approved',
        message: `You are now officially registered as a fleet tanker driver for ${verifiedSupplier.supplierName}. You will receive order dispatch notifications on WhatsApp at ${driverPhone}.`
      });
    } catch (err) {
      console.error(err);
      setDriverError(err.message || 'An error occurred during registration.');
    }
  };'''

content = re.sub(r'  const handleDriverSubmit = \(e\) => \{.*?  \};', handle_driver_submit, content, flags=re.DOTALL)

# 6. Modify handleBuyerSubmit
handle_buyer_submit = '''  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    setBuyerError('');
    if (buyerPassword.length < 12) {
      setBuyerError('Password must be at least 12 characters.');
      return;
    }
    if (buyerPassword !== buyerConfirmPassword) {
      setBuyerError('Passwords do not match.');
      return;
    }
    
    try {
      await api.auth.register({ email: buyerEmail, password: buyerPassword, role: 'BUYER' });
      await api.auth.login({ email: buyerEmail, password: buyerPassword });
      
      await api.companies.updateProfile({
        companyName: buyerCompany,
        registrationNumber: buyerRcNumber,
        businessAddress: `${latitude}, ${longitude}`,
        contactPhone: receivingOfficerPhone
      });

      setSubmitSuccess({
        role: 'buyer',
        title: 'Corporate Buyer Account Activated',
        message: `${buyerCompany} has been registered with verified discharge gate coordinates at (${latitude}, ${longitude}). You can now deposit into escrow and order directly from loading terminals.`
      });
    } catch (err) {
      console.error(err);
      setBuyerError(err.message || 'An error occurred during buyer registration.');
    }
  };'''

content = re.sub(r'  const handleBuyerSubmit = \(e\) => \{.*?  \};', handle_buyer_submit, content, flags=re.DOTALL)

# 7. Modify handleSupplierSubmit
handle_supplier_submit = '''  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    setSupplierError('');
    if (supplierPassword.length < 12) {
      setSupplierError('Password must be at least 12 characters.');
      return;
    }
    if (supplierPassword !== supplierConfirmPassword) {
      setSupplierError('Passwords do not match.');
      return;
    }
    
    try {
      await api.auth.register({ email: supplierEmail, password: supplierPassword, role: 'SUPPLIER' });
      await api.auth.login({ email: supplierEmail, password: supplierPassword });
      
      await api.companies.updateProfile({
        companyName: supplierName,
        registrationNumber: supplierRc,
        businessAddress: primaryDepot,
        contactPhone: contactPhone
      });

      setSubmitSuccess({
        role: 'supplier',
        title: 'Marketer Account Created',
        message: `${supplierName} has been registered under NMDPRA license ${supplierLicense}. You can now broadcast spot prices and generate one-time driver invitation links.`
      });
    } catch (err) {
      console.error(err);
      setSupplierError(err.message || 'An error occurred during supplier registration.');
    }
  };'''

content = re.sub(r'  const handleSupplierSubmit = \(e\) => \{.*?  \};', handle_supplier_submit, content, flags=re.DOTALL)

# 8. Driver Fields
driver_fields = '''              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Email Address</label>
                  <input type="email" required value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Password</label>
                  <input type="password" required value={driverPassword} onChange={(e) => setDriverPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Confirm Password</label>
                  <input type="password" required value={driverConfirmPassword} onChange={(e) => setDriverConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                {driverError && (
                  <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold">{driverError}</div>
                )}
'''
content = content.replace('              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">\n                <div>\n                  <label htmlFor="driver-name-in"', driver_fields + '                <div>\n                  <label htmlFor="driver-name-in"')

# 9. Buyer Fields
buyer_fields = '''              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Email Address</label>
                  <input type="email" required value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Password</label>
                  <input type="password" required value={buyerPassword} onChange={(e) => setBuyerPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Confirm Password</label>
                  <input type="password" required value={buyerConfirmPassword} onChange={(e) => setBuyerConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                {buyerError && (
                  <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold">{buyerError}</div>
                )}
'''
content = content.replace('              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">\n                <div>\n                  <label htmlFor="b-company"', buyer_fields + '                <div>\n                  <label htmlFor="b-company"')

# 10. Supplier Fields
supplier_fields = '''              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Email Address</label>
                  <input type="email" required value={supplierEmail} onChange={(e) => setSupplierEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Password</label>
                  <input type="password" required value={supplierPassword} onChange={(e) => setSupplierPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Confirm Password</label>
                  <input type="password" required value={supplierConfirmPassword} onChange={(e) => setSupplierConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                {supplierError && (
                  <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold">{supplierError}</div>
                )}
'''
content = content.replace('              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">\n                <div>\n                  <label htmlFor="s-company"', supplier_fields + '                <div>\n                  <label htmlFor="s-company"')


with open('src/components/RegisterPage.jsx', 'w') as f:
    f.write(content)
