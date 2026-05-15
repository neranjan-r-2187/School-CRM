import { useState, useRef } from 'react';
import { X, Upload, Download, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../../../lib/api';
import { toast } from 'sonner';

export const TimetableUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classId, setClassId] = useState('');
  const [section, setSection] = useState('');
  const fileInputRef = useRef(null);

  // Fetch classes for selection
  const [classes, setClasses] = useState([]);
  useState(() => {
    api.get('/classes').then(res => setClasses(res.data.data)).catch(err => console.error(err));
  }, []);

  const downloadTemplate = () => {
    const templateData = [
      {
        Day: 'Monday',
        Period: '1',
        'Start Time': '09:00',
        'End Time': '09:45',
        Subject: 'Mathematics',
        Teacher: 'John Doe',
        Room: '301'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
    XLSX.writeFile(wb, 'Timetable_Template.xlsx');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    parseExcel(selectedFile);
  };

  const parseExcel = (file) => {
    setIsParsing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Basic validation
        const requiredFields = ['Day', 'Period', 'Start Time', 'End Time', 'Subject', 'Teacher', 'Room'];
        const firstRow = json[0];
        
        if (json.length === 0) {
          throw new Error('Excel sheet is empty');
        }

        const missingFields = requiredFields.filter(f => !Object.keys(firstRow).includes(f));
        if (missingFields.length > 0) {
          throw new Error(`Missing columns: ${missingFields.join(', ')}`);
        }

        const formattedData = json.map(row => ({
          day: row.Day,
          period: String(row.Period),
          startTime: row['Start Time'],
          endTime: row['End Time'],
          subject: row.Subject,
          teacher: row.Teacher,
          room: String(row.Room)
        }));

        setPreviewData(formattedData);
        toast.success(`Successfully parsed ${json.length} rows`);
      } catch (err) {
        toast.error(err.message || 'Failed to parse Excel file');
        setFile(null);
        setPreviewData([]);
      } finally {
        setIsParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!classId || !section || previewData.length === 0) {
      toast.error('Please select class/section and provide valid timetable data');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/timetables/upload', {
        classId,
        section,
        rows: previewData
      });
      toast.success('Timetable submitted for admin approval');
      onUploadSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit timetable');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Upload Timetable</h2>
              <p className="text-sm text-slate-500">Submit class schedule for admin approval</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Step 1: Download Template</h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-600 mb-4">Use our standardized Excel format to ensure smooth processing.</p>
                <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm">
                  <Download className="w-4 h-4" />
                  Download Excel Template
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Step 2: Selection</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Target Class</label>
                  <select 
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Section</label>
                  <select 
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Step 3: Upload File</h3>
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx,.xls" />
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold text-slate-900">Click to Upload</p>
                <p className="text-sm text-slate-500 mt-1">Select an Excel file from your computer</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <FileText className="w-3 h-3" />
                  <span>Only .xlsx and .xls files supported</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB • Ready to submit</p>
                  </div>
                </div>
                <button onClick={() => { setFile(null); setPreviewData([]); }} className="text-sm font-bold text-red-600 hover:text-red-700">Remove</button>
              </div>
            )}
          </div>

          {previewData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Data Preview</h3>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-3">Day</th>
                      <th className="p-3">Period</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Teacher</th>
                      <th className="p-3">Room</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {previewData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium text-slate-900">{row.day}</td>
                        <td className="p-3">{row.period}</td>
                        <td className="p-3 text-slate-600">{row.startTime} - {row.endTime}</td>
                        <td className="p-3 font-semibold text-blue-600">{row.subject}</td>
                        <td className="p-3">{row.teacher}</td>
                        <td className="p-3 text-slate-500">{row.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length > 5 && (
                <p className="text-center text-xs text-slate-400 font-medium italic">Showing first 5 rows of {previewData.length} total rows</p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span>Admin approval is required before publishing</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!file || !classId || !section || isSubmitting || isParsing}
              className="px-8 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-950/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit for Approval
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
