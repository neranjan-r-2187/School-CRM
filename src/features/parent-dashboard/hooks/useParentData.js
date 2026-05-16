import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";
import { useData } from "../../../app/context/DataContext";

export const useParentStudentData = () => {
  const { linkedStudents } = useData();
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    if (linkedStudents?.length > 0 && !selectedStudentId) {
      setSelectedStudentId(linkedStudents[0]._id);
    }
  }, [linkedStudents]);

  const { data: studentData, isLoading, isError } = useQuery({
    queryKey: ["student-data", selectedStudentId],
    queryFn: async () => {
      const response = await api.get(`/parents/students/${selectedStudentId}/data`);
      return response.data.data;
    },
    enabled: !!selectedStudentId
  });

  return {
    linkedStudents,
    selectedStudentId,
    setSelectedStudentId,
    studentData: studentData || {},
    isLoading,
    isError
  };
};
