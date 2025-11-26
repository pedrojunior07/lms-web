import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCourseApi } from "../../api/hooks/useCourseApi";
import { useAuth } from "./AuthContextType";

type EnrollmentContextType = {
  enrolledCourseIds: Set<number>;
  loading: boolean;
  refreshEnrollments: () => Promise<void>;
  isEnrolled: (courseId: number | string | null | undefined) => boolean;
};

const EnrollmentContext = createContext<EnrollmentContextType>({
  enrolledCourseIds: new Set(),
  loading: false,
  refreshEnrollments: async () => {},
  isEnrolled: () => false,
});

const normalizeId = (
  courseId: number | string | null | undefined
): number | null => {
  if (courseId === null || courseId === undefined) {
    return null;
  }
  const parsed = Number(courseId);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
};

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { getCourcesStudents } = useCourseApi();
  const getCourcesStudentsRef = useRef(getCourcesStudents);
  useEffect(() => {
    getCourcesStudentsRef.current = getCourcesStudents;
  }, [getCourcesStudents]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const userId = user?.id;

  const persistIds = useCallback((ids: number[]) => {
    const idsSet = new Set(ids);
    setEnrolledCourseIds(idsSet);

    if (ids.length > 0) {
      localStorage.setItem("enrolledCourseIds", JSON.stringify(ids));
    } else {
      localStorage.removeItem("enrolledCourseIds");
    }
  }, []);

  useEffect(() => {
    const savedIds = localStorage.getItem("enrolledCourseIds");
    if (savedIds) {
      try {
        const parsed = JSON.parse(savedIds);
        if (Array.isArray(parsed)) {
          persistIds(
            parsed
              .map((id) => normalizeId(id))
              .filter((id): id is number => id !== null)
          );
        }
      } catch (error) {
        console.error("Erro ao carregar cursos armazenados localmente:", error);
      }
    }
  }, [persistIds]);

  const refreshEnrollments = useCallback(async () => {
    const studentId =
      userId || localStorage.getItem("id") || localStorage.getItem("userId");

    if (!isAuthenticated || !studentId) {
      persistIds([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getCourcesStudentsRef.current(
        { page: 0, size: 1000, sort: "title,asc" },
        studentId
      );
      const courses = data?.data?.content ?? data?.content ?? [];
      const ids = courses
        .map((course: any) => normalizeId(course?.id))
        .filter((id: number | null): id is number => id !== null);

      persistIds(ids);
    } catch (error) {
      console.error("Erro ao buscar cursos inscritos:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, persistIds, userId]);

  useEffect(() => {
    refreshEnrollments();
  }, [refreshEnrollments]);

  const isEnrolled = useCallback(
    (courseId: number | string | null | undefined) => {
      const normalized = normalizeId(courseId);
      if (normalized === null) {
        return false;
      }
      return enrolledCourseIds.has(normalized);
    },
    [enrolledCourseIds]
  );

  const value = useMemo(
    () => ({
      enrolledCourseIds,
      loading,
      refreshEnrollments,
      isEnrolled,
    }),
    [enrolledCourseIds, isEnrolled, loading, refreshEnrollments]
  );

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollments = () => useContext(EnrollmentContext);
