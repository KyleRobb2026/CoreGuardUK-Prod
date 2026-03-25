import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Button, Input, Select, Textarea, Modal, Spinner, EmptyState, StatusBadge, Badge } from '../components/shared';
import { FileText, Plus, Eye, Send, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function FormsPage() {
  const api = useApi();
  const [forms, setForms] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forms'); // forms | submissions | builder
  const [submissions, setSubmissions] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showSubmit, setShowSubmit] = useState(null);
  const [formData, setFormData] = useState({});
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderForm, setBuilderForm] = useState({ name: '', type: 'custom', fields: [] });

  useEffect(() => { fetchAll(); }, []);
  
  // Auto-seed prebuilt forms on first visit
  useEffect(() => {
    if (!loading && forms.length === 0) {
      api.post('/api/forms/seed-prebuilt').then(() => fetchAll()).catch(() => {});
    }
  }, [loading, forms.length]);

  const fetchAll = async () => {
    try {
      const [formsRes, sitesRes, subsRes] = await Promise.all([
        api.get('/api/forms'),
        api.get('/api/sites'),
        api.get('/api/form-submissions'),
      ]);
      setForms(formsRes.data);
      setSites(sitesRes.data);
      setSubmissions(subsRes.data);
    } catch { toast.error('Failed to load forms'); }
    finally { setLoading(false); }
  };

  const handleSeedPrebuilt = async () => {
    try {
      await api.post('/api/forms/seed-prebuilt');
      toast.success('Prebuilt forms loaded');
      fetchAll();
    } catch (err) { toast.error('Failed to seed forms'); }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/forms/${showSubmit.id}/submit`, { ...formData, site_id: formData.site_id });
      toast.success('Form submitted successfully');
      setShowSubmit(null);
      setFormData({});
      fetchAll();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed to submit form'); }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/forms', builderForm);
      toast.success('Form created');
      setShowBuilder(false);
      setBuilderForm({ name: '', type: 'custom', fields: [] });
      fetchAll();
    } catch (err) { toast.error('Failed to create form'); }
  };

  const addField = () => {
    const newField = { id: `f${Date.now()}`, type: 'text', label: '', required: false };
    setBuilderForm({ ...builderForm, fields: [...builderForm.fields, newField] });
  };

  const updateField = (idx, updates) => {
    const fields = [...builderForm.fields];
    fields[idx] = { ...fields[idx], ...updates };
    setBuilderForm({ ...builderForm, fields });
  };

  const removeField = (idx) => {
    setBuilderForm({ ...builderForm, fields: builderForm.fields.filter((_, i) => i !== idx) });
  };

  const typeColors = {
    incident: 'critical', patrol: 'success', visitor: 'info', welfare: 'warning', accident: 'critical', custom: 'default',
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="forms-page">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[#171717] border border-[#2e2e2e] rounded-lg p-1">
          {[['forms', 'Forms'], ['submissions', 'Submissions'], ['builder', 'Builder']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === key ? 'bg-[#f7b91c] text-white' : 'text-[#a1a0a0] hover:text-white'}`}
              data-testid={`forms-tab-${key}`}
            >{label}</button>
          ))}
        </div>
        {activeTab === 'forms' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeedPrebuilt} data-testid="seed-prebuilt-btn">Load Prebuilt</Button>
            <Button size="sm" onClick={() => setActiveTab('builder')}><Plus size={12} />Custom Form</Button>
          </div>
        )}
      </div>

      {/* Forms tab */}
      {activeTab === 'forms' && (
        <>
          {forms.length === 0 ? (
            <Card><EmptyState icon={FileText} message="No forms available" action={<Button onClick={handleSeedPrebuilt} size="sm">Load Prebuilt Forms</Button>} /></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map(form => (
                <Card key={form.id} className="hover:border-[#737373] transition-colors" data-testid={`form-card-${form.id}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white text-sm">{form.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={typeColors[form.type] || 'default'}>{form.type}</Badge>
                          {form.is_prebuilt && <Badge variant="info">Prebuilt</Badge>}
                        </div>
                      </div>
                      <FileText size={16} className="text-[#676767]" />
                    </div>
                    <div className="text-xs text-[#a1a0a0] mb-3">{form.fields?.length || 0} fields</div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => { setShowSubmit(form); setFormData({}); }}
                      data-testid={`fill-form-${form.id}`}
                    >
                      <Send size={12} /> Fill Form
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Submissions tab */}
      {activeTab === 'submissions' && (
        <Card>
          <CardHeader>
            <CardTitle>Form Submissions</CardTitle>
            <span className="text-xs text-[#a1a0a0] font-mono">{submissions.length} total</span>
          </CardHeader>
          {submissions.length === 0 ? (
            <EmptyState icon={FileText} message="No submissions yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2e2e2e]">
                    {['Form', 'Type', 'Submitted', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs text-[#a1a0a0] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2e2e2e]">
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-[#2d2d2d]/20" data-testid={`submission-row-${sub.id}`}>
                      <td className="px-4 py-3 text-white font-medium">{sub.form_name}</td>
                      <td className="px-4 py-3"><Badge variant={typeColors[sub.form_type] || 'default'}>{sub.form_type}</Badge></td>
                      <td className="px-4 py-3 font-mono text-xs text-[#a1a0a0]">
                        {sub.submitted_at ? format(new Date(sub.submitted_at), 'dd/MM/yyyy HH:mm') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedForm(sub)}
                          className="text-xs text-[#f7b91c] hover:underline"
                          data-testid={`view-submission-${sub.id}`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Builder tab */}
      {activeTab === 'builder' && (
        <Card>
          <CardHeader><CardTitle>Form Builder</CardTitle></CardHeader>
          <div className="p-5">
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Form Name *" value={builderForm.name} onChange={e => setBuilderForm({ ...builderForm, name: e.target.value })} required placeholder="e.g. Weekly Patrol Report" />
                <Select label="Form Type" value={builderForm.type} onChange={e => setBuilderForm({ ...builderForm, type: e.target.value })}>
                  {['custom', 'incident', 'patrol', 'visitor', 'welfare', 'accident'].map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#a1a0a0] font-medium">Fields ({builderForm.fields.length})</span>
                  <Button type="button" size="sm" variant="outline" onClick={addField}><Plus size={12} />Add Field</Button>
                </div>

                {builderForm.fields.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-[#2e2e2e] rounded-lg text-[#a1a0a0] text-sm">
                    Click "Add Field" to start building your form
                  </div>
                ) : (
                  <div className="space-y-2">
                    {builderForm.fields.map((field, idx) => (
                      <div key={field.id} className="flex items-center gap-3 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-3">
                        <select value={field.type} onChange={e => updateField(idx, { type: e.target.value })}
                          className="bg-[#171717] border border-[#2e2e2e] rounded-lg text-xs text-white px-2 py-1.5 outline-none">
                          {['text', 'textarea', 'checkbox', 'dropdown', 'signature', 'image', 'gps', 'datetime'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input type="text" value={field.label} onChange={e => updateField(idx, { label: e.target.value })}
                          placeholder="Field label" className="flex-1 bg-transparent border-b border-[#2e2e2e] text-sm text-white outline-none pb-1 placeholder:text-[#676767]" />
                        <label className="flex items-center gap-1 text-xs text-[#a1a0a0]">
                          <input type="checkbox" checked={field.required} onChange={e => updateField(idx, { required: e.target.checked })} className="accent-[#f7b91c]" />
                          Required
                        </label>
                        <button type="button" onClick={() => removeField(idx)} className="text-[#EF4444] hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={!builderForm.name || builderForm.fields.length === 0} data-testid="create-form-btn">
                Create Form
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Fill Form Modal */}
      <Modal open={!!showSubmit} onClose={() => { setShowSubmit(null); setFormData({}); }} title={showSubmit?.name || 'Fill Form'} size="lg">
        {showSubmit && (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <Select label="Site" value={formData.site_id || ''} onChange={e => setFormData({ ...formData, site_id: e.target.value })}>
              <option value="">Select Site (optional)</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            {showSubmit.fields?.map(field => (
              <div key={field.id}>
                {field.type === 'text' && (
                  <Input label={field.label + (field.required ? ' *' : '')} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} required={field.required} />
                )}
                {field.type === 'textarea' && (
                  <Textarea label={field.label + (field.required ? ' *' : '')} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} required={field.required} rows={3} />
                )}
                {field.type === 'datetime' && (
                  <Input type="datetime-local" label={field.label + (field.required ? ' *' : '')} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} required={field.required} />
                )}
                {field.type === 'dropdown' && (
                  <Select label={field.label + (field.required ? ' *' : '')} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} required={field.required}>
                    <option value="">Select option</option>
                    {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                )}
                {field.type === 'checkbox' && (
                  <div>
                    <label className="text-xs text-[#a1a0a0] font-medium block mb-2">{field.label}</label>
                    <div className="space-y-2">
                      {field.options?.map(o => (
                        <label key={o} className="flex items-center gap-2 text-sm text-white">
                          <input type="checkbox" className="accent-[#f7b91c]"
                            checked={(formData[field.id] || []).includes(o)}
                            onChange={e => {
                              const current = formData[field.id] || [];
                              setFormData({ ...formData, [field.id]: e.target.checked ? [...current, o] : current.filter(x => x !== o) });
                            }} />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {field.type === 'signature' && (
                  <Input label={field.label + (field.required ? ' *' : '')} placeholder="Type full name as signature" value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} required={field.required} />
                )}
                {field.type === 'gps' && (
                  <div>
                    <label className="text-xs text-[#a1a0a0] font-medium block mb-1">{field.label}</label>
                    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-2 text-xs text-[#a1a0a0] flex items-center gap-2">
                      GPS capture (latitude/longitude will be captured on submission)
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setShowSubmit(null); setFormData({}); }} type="button" className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1" data-testid="submit-filled-form"><Send size={14} />Submit</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Submission Modal */}
      <Modal open={!!selectedForm} onClose={() => setSelectedForm(null)} title="Submission Details" size="lg">
        {selectedForm && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-[#a1a0a0]">Form:</span><span className="text-white">{selectedForm.form_name}</span>
              <span className="text-[#a1a0a0]">Submitted:</span><span className="text-white font-mono text-xs">{selectedForm.submitted_at ? format(new Date(selectedForm.submitted_at), 'dd/MM/yyyy HH:mm') : '-'}</span>
            </div>
            <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-3">
              <pre className="text-xs text-[#a1a0a0] whitespace-pre-wrap overflow-auto max-h-64">
                {JSON.stringify(selectedForm.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
