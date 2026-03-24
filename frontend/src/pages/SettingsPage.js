import React, { useState, useEffect } from 'react';
import { useApi, useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Button, Input, Select, Modal, Spinner, Badge } from '../components/shared';
import { Settings, User, Users, Shield, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const api = useApi();
  const [org, setOrg] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('organisation');
  const [orgForm, setOrgForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [userForm, setUserForm] = useState({ email: '', password: '', first_name: '', last_name: '', role: 'viewer' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [orgRes, usersRes] = await Promise.all([
        api.get('/api/organisations/current'),
        api.get('/api/users'),
      ]);
      setOrg(orgRes.data);
      setOrgForm({ name: orgRes.data.name || '', email: orgRes.data.email || '', phone: orgRes.data.phone || '', address: orgRes.data.address || '' });
      setUsers(usersRes.data);
    } catch { toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  const handleSaveOrg = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/organisations/current', orgForm);
      toast.success('Organisation settings saved');
    } catch { toast.error('Failed to save settings'); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users', userForm);
      toast.success('User created');
      setShowAddUser(false);
      setUserForm({ email: '', password: '', first_name: '', last_name: '', role: 'viewer' });
      fetchAll();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed to create user'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/api/users/${userId}`);
      toast.success('User deleted');
      fetchAll();
    } catch { toast.error('Failed to delete user'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="settings-page">
      {/* Tabs */}
      <div className="flex gap-1 bg-[#171717] border border-[#2e2e2e] rounded-lg p-1 w-fit">
        {[['organisation', 'Organisation', Settings], ['users', 'Users', Users]].map(([key, label, Icon]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === key ? 'bg-[#f7b91c] text-white' : 'text-[#a1a0a0] hover:text-white'}`}
            data-testid={`settings-tab-${key}`}
          >
            <Icon size={12} />{label}
          </button>
        ))}
      </div>

      {/* Organisation tab */}
      {activeTab === 'organisation' && (
        <Card>
          <CardHeader><CardTitle>Organisation Settings</CardTitle></CardHeader>
          <div className="p-5">
            <form onSubmit={handleSaveOrg} className="max-w-lg space-y-4">
              <Input label="Organisation Name" value={orgForm.name} onChange={e => setOrgForm({ ...orgForm, name: e.target.value })} data-testid="org-name-setting" />
              <Input label="Email" type="email" value={orgForm.email} onChange={e => setOrgForm({ ...orgForm, email: e.target.value })} data-testid="org-email-setting" />
              <Input label="Phone" value={orgForm.phone} onChange={e => setOrgForm({ ...orgForm, phone: e.target.value })} data-testid="org-phone-setting" />
              <Input label="Address" value={orgForm.address} onChange={e => setOrgForm({ ...orgForm, address: e.target.value })} data-testid="org-address-setting" />
              <Button type="submit" data-testid="save-org-btn"><Save size={14} />Save Changes</Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#2e2e2e]">
              <h4 className="text-sm font-bold text-white mb-3">Platform Info</h4>
              <div className="grid grid-cols-2 gap-2 text-sm max-w-md">
                {[
                  ['Platform', 'CoreGuard SMS v1.0'],
                  ['Edition', 'Enterprise'],
                  ['Auth', 'JWT + Officer PIN'],
                  ['Database', 'MongoDB'],
                ].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span className="text-[#a1a0a0]">{k}:</span>
                    <span className="text-white font-mono text-xs">{v}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <Button size="sm" onClick={() => setShowAddUser(true)} data-testid="add-user-btn"><Plus size={12} />Add User</Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2e2e2e]">
                  {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#a1a0a0] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#2d2d2d]/20" data-testid={`user-row-${u.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-xs font-bold text-[#f7b91c]">
                          {u.first_name?.[0]}{u.last_name?.[0]}
                        </div>
                        <span className="text-white">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#a1a0a0]">{u.email}</td>
                    <td className="px-4 py-3"><Badge variant={u.role === 'admin' ? 'critical' : 'default'}>{u.role}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={u.active ? 'success' : 'default'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3">
                      {u.id !== user?.id && (
                        <button onClick={() => handleDeleteUser(u.id)} className="text-[#EF4444] hover:text-red-400 transition-colors" data-testid={`delete-user-${u.id}`}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={showAddUser} onClose={() => setShowAddUser(false)} title="Add New User">
        <form onSubmit={handleAddUser} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name *" value={userForm.first_name} onChange={e => setUserForm({ ...userForm, first_name: e.target.value })} required data-testid="user-first-name-input" />
            <Input label="Last Name *" value={userForm.last_name} onChange={e => setUserForm({ ...userForm, last_name: e.target.value })} required data-testid="user-last-name-input" />
          </div>
          <Input label="Email *" type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required data-testid="user-email-input" />
          <Input label="Password *" type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required data-testid="user-password-input" />
          <Select label="Role" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} data-testid="user-role-select">
            {['admin', 'operations', 'compliance', 'viewer'].map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </Select>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAddUser(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" data-testid="create-user-submit">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
