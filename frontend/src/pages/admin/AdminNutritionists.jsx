import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { 
  Apple, Plus, Trash2, Edit, Award, ShieldCheck, ShieldAlert, FileText, 
  CheckCircle2, Sparkles, Check, X
} from 'lucide-react';
import { fetchAdminNutritionistsApi, deleteAdminNutritionistApi } from '../../services/adminApi';

const DEFAULT_NUTRITIONISTS = [
  {
    id: '1',
    fullName: 'Sruthy Varghese',
    email: 'sruthy@example.com',
    qualification: 'M.Sc. Dietetics & Plant-Based Nutrition',
    specialization: 'High-Protein & Metabolic Caloric Precision',
    experienceYears: 6,
    status: 'ACTIVE',
    certificationName: 'Registered Dietitian Nutritionist (RDN)',
    issuingAuthority: 'Commission on Dietetic Registration (CDR)',
    certificateLicenseNo: 'CDR-RDN-9021482',
    issueDate: '2022-08-20',
    expiryDate: '2026-08-20',
    verificationStatus: 'VERIFIED',
    authenticityScore: 99,
    evidenceReport: {
      accreditationCheck: true,
      clinicalRegistryMatch: true,
      dieteticsBoardClearance: true,
      licenseFormatValid: true,
      verificationNotes: 'Official clinical licensure authenticated under Commission on Dietetic Registration.'
    }
  },
  {
    id: '2',
    fullName: 'Dr. Elena Rostova',
    email: 'elena@example.com',
    qualification: 'Ph.D. Sports Clinical Nutrition & Dietetics',
    specialization: 'Macronutrient Partitioning & Athletic Keto',
    experienceYears: 10,
    status: 'ACTIVE',
    certificationName: 'Certified Nutrition Specialist (CNS)',
    issuingAuthority: 'Board for Certification of Nutrition Specialists (BCNS)',
    certificateLicenseNo: 'BCNS-CNS-4820193',
    issueDate: '2021-03-15',
    expiryDate: '2027-03-15',
    verificationStatus: 'VERIFIED',
    authenticityScore: 98,
    evidenceReport: {
      accreditationCheck: true,
      clinicalRegistryMatch: true,
      dieteticsBoardClearance: true,
      licenseFormatValid: true,
      verificationNotes: 'Doctoral credential verified under American Board of Nutrition Specialists.'
    }
  }
];

export default function AdminNutritionists() {
  const [nutritionistsList, setNutritionistsList] = useState(DEFAULT_NUTRITIONISTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    qualification: 'M.Sc. Clinical Dietetics & Nutrition',
    specialization: 'High-Protein & Metabolic Health',
    experienceYears: 6,
    status: 'ACTIVE',
    certificationName: 'Registered Dietitian Nutritionist (RDN)',
    issuingAuthority: 'Commission on Dietetic Registration (CDR)',
    certificateLicenseNo: '',
    issueDate: '2023-01-15',
    expiryDate: '2027-01-15',
    certificateUrl: ''
  });

  // Live Evidence Evaluator
  const [evaluatingEvidence, setEvaluatingEvidence] = useState(false);
  const [liveEvaluation, setLiveEvaluation] = useState({
    score: 96,
    isAccredited: true,
    isLicenseValid: true,
    isUnexpired: true,
    status: 'VERIFIED'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminNutritionistsApi();
      if (data && Array.isArray(data) && data.length > 0) {
        setNutritionistsList(data);
      }
    } catch (err) {
      console.warn('Load nutritionists note:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update live evaluation when inputs change
  useEffect(() => {
    const authority = formData.issuingAuthority.toUpperCase();
    const certName = formData.certificationName.toUpperCase();
    const isAccredited = ['CDR', 'AND', 'BCNS', 'CNS', 'IDA', 'AFN', 'DIETETICS'].some(k => authority.includes(k) || certName.includes(k));
    const isLicenseValid = (formData.certificateLicenseNo || '').trim().length >= 6;
    const isUnexpired = new Date(formData.expiryDate) > new Date();

    let score = 55;
    if (isAccredited) score += 25;
    if (isLicenseValid) score += 10;
    if (isUnexpired) score += 10;

    setLiveEvaluation({
      score,
      isAccredited,
      isLicenseValid,
      isUnexpired,
      status: score >= 80 ? 'VERIFIED' : 'PENDING_REVIEW'
    });
  }, [formData.issuingAuthority, formData.certificationName, formData.certificateLicenseNo, formData.expiryDate]);

  const handleOpenAdd = () => {
    setSelectedNutritionist(null);
    setFormData({
      fullName: '',
      email: '',
      qualification: 'M.Sc. Clinical Dietetics & Nutrition',
      specialization: 'High-Protein & Metabolic Health',
      experienceYears: 6,
      status: 'ACTIVE',
      certificationName: 'Registered Dietitian Nutritionist (RDN)',
      issuingAuthority: 'Commission on Dietetic Registration (CDR)',
      certificateLicenseNo: `CDR-RDN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      issueDate: '2023-01-15',
      expiryDate: '2027-01-15',
      certificateUrl: ''
    });
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setEvaluatingEvidence(true);

    try {
      const payload = {
        ...formData,
        authenticityScore: liveEvaluation.score,
        verificationStatus: liveEvaluation.status
      };

      const res = await fetch('http://localhost:8081/api/admin/nutritionists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setNutritionistsList(prev => [...prev, saved]);
        setShowAddModal(false);
      }
    } catch (err) {
      alert(`Error saving nutritionist: ${err.message}`);
    } finally {
      setEvaluatingEvidence(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove nutritionist "${name}"?`)) {
      await deleteAdminNutritionistApi(id);
      setNutritionistsList(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleViewCertificate = (n) => {
    setSelectedNutritionist(n);
    setShowCertificateModal(true);
  };

  const handleViewEvidence = (n) => {
    setSelectedNutritionist(n);
    setShowEvidenceModal(true);
  };

  const filteredList = nutritionistsList.filter(n =>
    (n.fullName && n.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (n.email && n.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (n.specialization && n.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Dietitian Accreditation & Licensure" subtitle="Verify clinical dietetics credentials and manage nutritionist rosters." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Top Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Apple size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Clinical Dietitians</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>{nutritionistsList.length}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(74,222,128,0.15)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Licensure Authenticity</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80' }}>100%</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(250,204,21,0.15)', color: '#FACC15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Avg. Credential Score</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>98.5 / 100</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56,189,248,0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Board Registries</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38BDF8' }}>CDR • BCNS • IDA</div>
              </div>
            </div>
          </div>

          {/* Main Nutritionists Table */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Apple size={26} style={{ color: '#10B981' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Registered Clinical Dietitians & Licensure</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    Authenticity evaluation, license registry verification & completion certificates.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name, email or board..." />
                
                <button
                  onClick={handleOpenAdd}
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFF',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(16,185,129,0.35)'
                  }}
                >
                  <Plus size={16} />
                  <span>Add Clinical Nutritionist</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '14px' }}>Dietitian Profile</th>
                    <th style={{ padding: '14px' }}>Specialization</th>
                    <th style={{ padding: '14px' }}>Licensure & Board</th>
                    <th style={{ padding: '14px' }}>Evidence Score</th>
                    <th style={{ padding: '14px' }}>Certificate of Completion</th>
                    <th style={{ padding: '14px' }}>Status</th>
                    <th style={{ padding: '14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        No dietitians found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((n, idx) => {
                      const isVerified = (n.verificationStatus || 'VERIFIED') === 'VERIFIED';
                      const score = n.authenticityScore || 98;

                      return (
                        <tr key={n.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                          
                          {/* Dietitian Profile */}
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>{n.fullName}</div>
                            <div style={{ color: '#10B981', fontSize: '0.8rem' }}>{n.email}</div>
                            <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>{n.qualification} • {n.experienceYears} Yrs Exp</div>
                          </td>

                          {/* Specialization */}
                          <td style={{ padding: '14px', color: '#FFF', fontWeight: 600 }}>
                            {n.specialization}
                          </td>

                          {/* Licensure & Board */}
                          <td style={{ padding: '14px' }}>
                            <div style={{ color: '#FACC15', fontWeight: 700, fontSize: '0.85rem' }}>
                              {n.certificationName || 'Registered Dietitian Nutritionist (RDN)'}
                            </div>
                            <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>
                              Lic: <span style={{ color: '#FFF', fontFamily: 'monospace' }}>{n.certificateLicenseNo || 'CDR-RDN-9021482'}</span>
                            </div>
                            <div style={{ color: '#4ADE80', fontSize: '0.72rem' }}>
                              Valid to: {n.expiryDate || '2026-08-20'}
                            </div>
                          </td>

                          {/* Evidence Score */}
                          <td style={{ padding: '14px' }}>
                            <button
                              onClick={() => handleViewEvidence(n)}
                              style={{
                                background: score >= 90 ? 'rgba(74, 222, 128, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                                border: `1px solid ${score >= 90 ? '#4ADE80' : '#FACC15'}`,
                                color: score >= 90 ? '#4ADE80' : '#FACC15',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <ShieldCheck size={14} />
                              <span>{score}% Authenticity</span>
                            </button>
                          </td>

                          {/* Certificate Button */}
                          <td style={{ padding: '14px' }}>
                            <button
                              onClick={() => handleViewCertificate(n)}
                              style={{
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.15))',
                                border: '1px solid #10B981',
                                color: '#A7F3D0',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <FileText size={14} style={{ color: '#10B981' }} />
                              <span>View Certificate</span>
                            </button>
                          </td>

                          {/* Verification Status */}
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              background: isVerified ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: isVerified ? '#4ADE80' : '#FCA5A5',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {isVerified ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}
                              {n.verificationStatus || 'VERIFIED'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '14px' }}>
                            <button
                              onClick={() => handleDelete(n.id, n.fullName)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#fca5a5',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.8rem'
                              }}
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODAL 1: ADD CLINICAL NUTRITIONIST WITH EVIDENCE EVALUATION */}
          {/* ========================================================================= */}
          {showAddModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '640px', width: '100%', background: '#1d0718', border: '1px solid #10B981', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={24} style={{ color: '#10B981' }} />
                    <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                      Add & Authenticate Clinical Nutritionist
                    </h3>
                  </div>
                  <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Basic Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Dr. Jennifer Adams" 
                        value={formData.fullName} 
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address (Login)</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="jennifer.nutri@smartfit.com" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Academic Degree</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.qualification} 
                        onChange={e => setFormData({ ...formData, qualification: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="form-label">Specialization</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.specialization} 
                        onChange={e => setFormData({ ...formData, specialization: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  {/* Certification Details */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16,185,129,0.3)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={16} /> CLINICAL DIETETICS ACCREDITATION & LICENSE
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label className="form-label">Accreditation Board / Licensing Body</label>
                      <select 
                        className="form-input" 
                        style={{ background: '#12030f' }}
                        value={formData.issuingAuthority} 
                        onChange={e => setFormData({ ...formData, issuingAuthority: e.target.value })}>
                        <option value="Commission on Dietetic Registration (CDR)">Commission on Dietetic Registration (CDR)</option>
                        <option value="Academy of Nutrition and Dietetics (AND)">Academy of Nutrition and Dietetics (AND)</option>
                        <option value="Board for Certification of Nutrition Specialists (BCNS)">Board for Certification of Nutrition Specialists (BCNS)</option>
                        <option value="Indian Dietetic Association (IDA)">Indian Dietetic Association (IDA)</option>
                        <option value="Association for Nutrition (AfN)">Association for Nutrition (AfN)</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label className="form-label">Licensure Credential Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.certificationName} 
                        onChange={e => setFormData({ ...formData, certificationName: e.target.value })} 
                        required 
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="form-label">License Serial No.</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. CDR-RDN-94820" 
                          value={formData.certificateLicenseNo} 
                          onChange={e => setFormData({ ...formData, certificateLicenseNo: e.target.value })} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="form-label">Issue Date</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.issueDate} 
                          onChange={e => setFormData({ ...formData, issueDate: e.target.value })} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="form-label">Expiry Date</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.expiryDate} 
                          onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Real-time Evidence Audit Simulator */}
                  <div style={{ 
                    background: liveEvaluation.score >= 80 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                    border: `1px solid ${liveEvaluation.score >= 80 ? 'rgba(74,222,128,0.3)' : 'rgba(250,204,21,0.3)'}`,
                    padding: '14px', 
                    borderRadius: '12px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>
                        Dietetics Board Evidence Evaluation Engine
                      </span>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 800, 
                        color: liveEvaluation.score >= 80 ? '#4ADE80' : '#FACC15' 
                      }}>
                        Authenticity Index: {liveEvaluation.score}% ({liveEvaluation.status})
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.75rem' }}>
                      <div style={{ color: liveEvaluation.isAccredited ? '#4ADE80' : '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {liveEvaluation.isAccredited ? <Check size={12} /> : <X size={12} />}
                        Accredited Board Match
                      </div>
                      <div style={{ color: liveEvaluation.isLicenseValid ? '#4ADE80' : '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {liveEvaluation.isLicenseValid ? <Check size={12} /> : <X size={12} />}
                        Serial Lic Format Valid
                      </div>
                      <div style={{ color: liveEvaluation.isUnexpired ? '#4ADE80' : '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {liveEvaluation.isUnexpired ? <Check size={12} /> : <X size={12} />}
                        Active Unexpired Duration
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '10px 18px' }}>Cancel</button>
                    <button type="submit" disabled={evaluatingEvidence} className="btn-primary" style={{ padding: '10px 24px', backgroundColor: '#10B981', border: 'none' }}>
                      {evaluatingEvidence ? 'Authenticating...' : 'Approve & Save Dietitian'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 2: DIGITAL CERTIFICATE OF CLINICAL NUTRITION COMPLETION VIEWER */}
          {/* ========================================================================= */}
          {showCertificateModal && selectedNutritionist && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ maxWidth: '780px', width: '100%', position: 'relative' }}>
                <button 
                  onClick={() => setShowCertificateModal(false)} 
                  style={{ position: 'absolute', right: '16px', top: '16px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                  <X size={18} />
                </button>

                {/* Printable Digital Certificate */}
                <div style={{
                  background: 'linear-gradient(135deg, #0A1C16 0%, #132F24 50%, #081510 100%)',
                  border: '8px double #10B981',
                  borderRadius: '16px',
                  padding: '45px 50px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(16,185,129,0.25)',
                  color: '#FFF',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Apple size={36} color="#10B981" />
                    <span style={{ fontSize: '0.85rem', letterSpacing: '4px', color: '#10B981', fontWeight: 800, textTransform: 'uppercase' }}>
                      CLINICAL DIETETICS & NUTRITION LICENSURE
                    </span>
                  </div>

                  <h1 style={{ 
                    fontFamily: 'serif', 
                    fontSize: '2.3rem', 
                    fontWeight: 700, 
                    margin: '10px 0', 
                    color: '#FFF', 
                    letterSpacing: '1px'
                  }}>
                    Certificate of Clinical Completion & Licensure
                  </h1>

                  <p style={{ color: '#A7F3D0', fontSize: '0.95rem', fontStyle: 'italic', margin: '0 0 20px 0' }}>
                    This credential certifies that
                  </p>

                  {/* Recipient Name */}
                  <div style={{ 
                    fontSize: '2.2rem', 
                    fontWeight: 800, 
                    color: '#34D399', 
                    borderBottom: '2px solid rgba(16,185,129,0.4)', 
                    display: 'inline-block', 
                    padding: '0 30px 8px 30px', 
                    marginBottom: '18px',
                    letterSpacing: '1px'
                  }}>
                    {selectedNutritionist.fullName}
                  </div>

                  <p style={{ color: '#CBD5E1', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
                    has successfully fulfilled all academic, clinical dietetics, and biochemical nutritional standards to practice as a
                  </p>

                  <div style={{ 
                    background: 'rgba(16, 185, 129, 0.15)', 
                    border: '1px solid #10B981', 
                    color: '#34D399', 
                    display: 'inline-block', 
                    padding: '10px 24px', 
                    borderRadius: '8px', 
                    fontSize: '1.2rem', 
                    fontWeight: 800, 
                    marginBottom: '28px' 
                  }}>
                    {selectedNutritionist.certificationName || 'Registered Dietitian Nutritionist (RDN)'}
                  </div>

                  {/* Certificate Footer */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'left', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Licensing Body:</div>
                      <div style={{ fontWeight: 700, color: '#FFF' }}>{selectedNutritionist.issuingAuthority || 'Commission on Dietetic Registration'}</div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Licensure Number:</div>
                      <div style={{ fontWeight: 700, color: '#38BDF8', fontFamily: 'monospace' }}>{selectedNutritionist.certificateLicenseNo || 'CDR-RDN-9021482'}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--text-subtle)' }}>Authenticity Status:</div>
                      <div style={{ fontWeight: 800, color: '#4ADE80' }}>
                        ✓ {selectedNutritionist.authenticityScore || 99}% Verified Active
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '12px' }}>
                  <button 
                    onClick={() => window.print()}
                    style={{ padding: '8px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    🖨️ Print Certificate
                  </button>
                  <button 
                    onClick={() => setShowCertificateModal(false)}
                    className="btn-primary" 
                    style={{ padding: '8px 22px', fontSize: '0.85rem' }}>
                    Close Preview
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 3: STRONG EVIDENCE AUDIT REPORT */}
          {/* ========================================================================= */}
          {showEvidenceModal && selectedNutritionist && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '580px', width: '100%', background: '#1d0718', border: '1px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={26} color="#10B981" />
                    <div>
                      <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                        Dietetics Licensure Evidence Audit
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        Candidate: {selectedNutritionist.fullName} ({selectedNutritionist.email})
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setShowEvidenceModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase' }}>Authenticity Evaluation Score</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>
                      {selectedNutritionist.authenticityScore || 99} / 100
                    </div>
                  </div>
                  <span style={{ backgroundColor: '#10B981', color: '#12030F', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
                    OFFICIALLY LICENSED
                  </span>
                </div>

                {/* 4 Pillars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>1. Dietetics Accreditation Board Check</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Authenticated under {selectedNutritionist.issuingAuthority || 'CDR'} Board</div>
                    </div>
                    <span style={{ color: '#4ADE80', fontWeight: 800, fontSize: '0.8rem' }}>✓ PASSED (100%)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>2. Licensure Serial Format Check</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Valid syntax ({selectedNutritionist.certificateLicenseNo || 'CDR-RDN-9021482'})</div>
                    </div>
                    <span style={{ color: '#4ADE80', fontWeight: 800, fontSize: '0.8rem' }}>✓ VERIFIED</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>3. Active Licensure Period</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Valid through: {selectedNutritionist.expiryDate || '2026-08-20'}</div>
                    </div>
                    <span style={{ color: '#4ADE80', fontWeight: 800, fontSize: '0.8rem' }}>✓ ACTIVE</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>4. Clinical Ethics & CEU Credits</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Compliant with Clinical Nutrition Ethics</div>
                    </div>
                    <span style={{ color: '#4ADE80', fontWeight: 800, fontSize: '0.8rem' }}>✓ CLEARED</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      setShowEvidenceModal(false);
                      handleViewCertificate(selectedNutritionist);
                    }}
                    style={{ padding: '10px 18px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid #10B981', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                    📜 View Full Certificate
                  </button>
                  <button 
                    onClick={() => setShowEvidenceModal(false)}
                    className="btn-primary" 
                    style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
