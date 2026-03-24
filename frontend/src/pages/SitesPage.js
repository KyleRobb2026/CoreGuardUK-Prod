import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Button, Input, Select, Modal, Spinner, EmptyState, StatusBadge } from '../components/shared';
import { MapPin, Plus, Search, Building2, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function SitesPage() {
  const api = useApi();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '', address: '', latitude: '', longitude: '',
    contact_name: '', contact_phone: '', type: 'commercial',
  });

  useEffect(() => { fetchSites(); }, []);

  const fetchSites = async () => {
    try {
      const res = await api.get('/api/sites');
      setSites(res.data);
    } catch { toast.error('Failed to load sites'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null };
      await api.post('/api/sites', payload);
      toast.success('Site created');
      setShowAdd(false);
      setForm({ name: '', address: '', latitude: '', longitude: '', contact_name: '', contact_phone: '', type: 'commercial' });
      fetchSites();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed to create site'); }
  };

  const filtered = sites.filter(s =>
    `${s.name} ${s.address} ${s.type}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="sites-page">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
          <input type="text" placeholder="Search sites..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-[#171717] border border-[#2e2e2e] rounded-lg h-9 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none focus:border-[#f7b91c] w-56" />
        </div>
        <Button onClick={() => setShowAdd(true)} data-testid="add-site-btn"><Plus size={14} /> Add Site</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sites', value: sites.length },
          { label: 'Active', value: sites.filter(s => s.status === 'active').length, color: 'text-[#22C55E]' },
          { label: 'Commercial', value: sites.filter(s => s.type === 'commercial').length },
          { label: 'Industrial', value: sites.filter(s => s.type === 'industrial').length },
        ].map(({ label, value, color = 'text-white' }) => (
          <Card key={label} className="p-3">
            <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">{label}</div>
            <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
          </Card>
        ))}
      </div>

      {/* Site cards */}
      {filtered.length === 0 ? (
        <Card><EmptyState icon={MapPin} message="No sites found" action={<Button onClick={() => setShowAdd(true)} size="sm"><Plus size={12} />Add First Site</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(site => (
            <Card key={site.id} className="hover:border-[#737373] transition-colors" data-testid={`site-card-${site.id}`}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#2d2d2d] rounded-lg flex items-center justify-center">
                      <Building2 size={16} className="text-[#f7b91c]" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{site.name}</div>
                      <span className="text-xs text-[#a1a0a0] capitalize">{site.type}</span>
                    </div>
                  </div>
                  <StatusBadge status={site.status} />
                </div>

                <div className="space-y-2 text-xs text-[#a1a0a0]">
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0 text-[#676767]" />
                    <span className="leading-relaxed">{site.address}</span>
                  </div>
                  {site.contact_name && (
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-[#676767]" />
                      <span>{site.contact_name}</span>
                    </div>
                  )}
                  {site.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-[#676767]" />
                      <span>{site.contact_phone}</span>
                    </div>
                  )}
                  {site.latitude && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#676767]">{site.latitude.toFixed(4)}, {site.longitude?.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Site" size="md">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Input label="Site Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required data-testid="site-name-input" />
          <Input label="Address *" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required data-testid="site-address-input" />
          <Select label="Site Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {['commercial', 'residential', 'industrial', 'event', 'retail', 'government'].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="51.5074" />
            <Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="-0.1278" />
          </div>
          <Input label="Contact Name" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} />
          <Input label="Contact Phone" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAdd(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" data-testid="submit-add-site">Create Site</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
