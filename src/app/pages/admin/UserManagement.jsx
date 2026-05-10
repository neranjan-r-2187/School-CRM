import { useState } from "react";
import { Search, Plus, Edit, Trash2, UserCheck, UserX, X } from "lucide-react";
import { mockTeachers, mockStudents, mockStaff } from "../../data/userManagementData";
import { useNotifications } from "../../context/NotificationContext";
export const UserManagement = () => {
  const { showToast } = useNotifications();
  const [activeTab, setActiveTab] = useState("Teacher");
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState(mockTeachers);
  const [students, setStudents] = useState(mockStudents);
  const [staff, setStaff] = useState(mockStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Teacher"
  });
  const getCurrentUsers = () => {
    switch (activeTab) {
      case "Teacher":
        return teachers;
      case "Student":
        return students;
      case "Staff":
        return staff;
    }
  };
  const filteredUsers = getCurrentUsers().filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) || user.phone.includes(searchQuery)
  );
  const handleOpenModal = (user) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subject: user.subject,
        classes: user.classes?.join(", "),
        class: user.class,
        section: user.section,
        rollNumber: user.rollNumber,
        parentName: user.parentName,
        parentPhone: user.parentPhone,
        department: user.department,
        position: user.position
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: activeTab
      });
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Teacher"
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: editingUser?.id || `${activeTab[0]}${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      dateJoined: editingUser?.dateJoined || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: editingUser?.status || "Active",
      avatar: editingUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
      subject: formData.subject,
      classes: formData.classes ? formData.classes.split(",").map((c) => c.trim()) : void 0,
      class: formData.class,
      section: formData.section,
      rollNumber: formData.rollNumber,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      department: formData.department,
      position: formData.position
    };
    if (editingUser) {
      switch (activeTab) {
        case "Teacher":
          setTeachers((prev) => prev.map((t) => t.id === editingUser.id ? newUser : t));
          break;
        case "Student":
          setStudents((prev) => prev.map((s) => s.id === editingUser.id ? newUser : s));
          break;
        case "Staff":
          setStaff((prev) => prev.map((st) => st.id === editingUser.id ? newUser : st));
          break;
      }
      showToast("success", `${activeTab} Updated`, `${newUser.name} has been updated successfully.`);
    } else {
      switch (activeTab) {
        case "Teacher":
          setTeachers((prev) => [...prev, newUser]);
          break;
        case "Student":
          setStudents((prev) => [...prev, newUser]);
          break;
        case "Staff":
          setStaff((prev) => [...prev, newUser]);
          break;
      }
      showToast("success", `${activeTab} Added`, `${newUser.name} has been added successfully.`);
    }
    handleCloseModal();
  };
  const handleDelete = (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }
    switch (activeTab) {
      case "Teacher":
        setTeachers((prev) => prev.filter((t) => t.id !== userId));
        break;
      case "Student":
        setStudents((prev) => prev.filter((s) => s.id !== userId));
        break;
      case "Staff":
        setStaff((prev) => prev.filter((st) => st.id !== userId));
        break;
    }
    showToast("success", `${activeTab} Deleted`, `${userName} has been removed from the system.`);
  };
  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const updateStatus = (users) => users.map((u) => u.id === userId ? { ...u, status: newStatus } : u);
    switch (activeTab) {
      case "Teacher":
        setTeachers(updateStatus);
        break;
      case "Student":
        setStudents(updateStatus);
        break;
      case "Staff":
        setStaff(updateStatus);
        break;
    }
    showToast("info", "Status Updated", `User status changed to ${newStatus}.`);
  };
  return <div className="min-h-screen bg-slate-50">
      {
    /* Header */
  }
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage teachers, students, and staff members</p>
        </div>
      </div>

      <div className="p-8">
        {
    /* Tabs */
  }
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            {["Teacher", "Student", "Staff"].map((tab) => <button
    key={tab}
    onClick={() => setActiveTab(tab)}
    className={`px-6 py-4 font-medium transition-colors relative ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600 hover:text-slate-900"}`}
  >
                {tab}s ({tab === "Teacher" ? teachers.length : tab === "Student" ? students.length : staff.length})
              </button>)}
          </div>

          {
    /* Search and Add */
  }
          <div className="p-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
    type="text"
    placeholder={`Search ${activeTab.toLowerCase()}s...`}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
            </div>
            <button
    onClick={() => handleOpenModal()}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
  >
              <Plus className="w-4 h-4" />
              Add {activeTab}
            </button>
          </div>
        </div>

        {
    /* User List */
  }
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    {activeTab === "Teacher" ? "Subject" : activeTab === "Student" ? "Class" : "Department"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
    src={user.avatar}
    alt={user.name}
    className="w-10 h-10 rounded-full"
  />
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{user.email}</div>
                      <div className="text-sm text-slate-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {activeTab === "Teacher" ? user.subject : activeTab === "Student" ? `${user.class}-${user.section}` : user.department}
                      </div>
                      {activeTab === "Teacher" && user.classes && <div className="text-xs text-slate-500">{user.classes.join(", ")}</div>}
                      {activeTab === "Student" && user.rollNumber && <div className="text-xs text-slate-500">Roll: {user.rollNumber}</div>}
                      {activeTab === "Staff" && user.position && <div className="text-xs text-slate-500">{user.position}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span
    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
  >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.dateJoined).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
    onClick={() => handleToggleStatus(user.id, user.status)}
    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
    title={user.status === "Active" ? "Deactivate" : "Activate"}
  >
                          {user.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
    onClick={() => handleOpenModal(user)}
    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    title="Edit"
  >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => handleDelete(user.id, user.name)}
    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    title="Delete"
  >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && <div className="text-center py-12">
              <div className="text-slate-400 text-lg">No {activeTab.toLowerCase()}s found</div>
              <p className="text-slate-500 mt-2">Try adjusting your search query</p>
            </div>}
        </div>
      </div>

      {
    /* Add/Edit Modal */
  }
      {isModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingUser ? `Edit ${activeTab}` : `Add New ${activeTab}`}
              </h2>
              <button
    onClick={handleCloseModal}
    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {
    /* Common Fields */
  }
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
    type="text"
    required
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Enter full name"
  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
    type="email"
    required
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="email@school.edu.in"
  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone *
                  </label>
                  <input
    type="tel"
    required
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="+91 98765 43210"
  />
                </div>
              </div>

              {
    /* Teacher Specific Fields */
  }
              {activeTab === "Teacher" && <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
    type="text"
    required
    value={formData.subject || ""}
    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="e.g., Mathematics"
  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Classes (comma separated)
                    </label>
                    <input
    type="text"
    value={formData.classes || ""}
    onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Class 10-A, Class 10-B"
  />
                  </div>
                </>}

              {
    /* Student Specific Fields */
  }
              {activeTab === "Student" && <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Class *
                      </label>
                      <input
    type="text"
    required
    value={formData.class || ""}
    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Class 10"
  />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Section *
                      </label>
                      <input
    type="text"
    required
    value={formData.section || ""}
    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="A"
  />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Roll Number *
                      </label>
                      <input
    type="text"
    required
    value={formData.rollNumber || ""}
    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="001"
  />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Parent Name *
                      </label>
                      <input
    type="text"
    required
    value={formData.parentName || ""}
    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Parent's full name"
  />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Parent Phone *
                      </label>
                      <input
    type="tel"
    required
    value={formData.parentPhone || ""}
    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="+91 98765 00000"
  />
                    </div>
                  </div>
                </>}

              {
    /* Staff Specific Fields */
  }
              {activeTab === "Staff" && <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Department *
                    </label>
                    <input
    type="text"
    required
    value={formData.department || ""}
    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="e.g., Administration"
  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Position *
                    </label>
                    <input
    type="text"
    required
    value={formData.position || ""}
    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="e.g., Principal"
  />
                  </div>
                </>}

              {
    /* Action Buttons */
  }
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
    type="button"
    onClick={handleCloseModal}
    className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
  >
                  {editingUser ? "Update" : "Add"} {activeTab}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
