import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import CustomSelect from "../../../core/common/commonSelect";

import {
  CourseCategory,
  CourseLevel,
  CourseVideo,
  Language,
  PrivateCourse,
} from "../../../core/common/selectOption/json/selectOption";
import DefaultEditor from "react-simple-wysiwyg";
import VideoModal from "../../HomePages/home-one/section/videoModal";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Chips, ChipsChangeEvent } from "primereact/chips";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
import { toast } from "react-toastify";
import { Modal, ProgressBar } from "react-bootstrap";
import { useLocalUploader } from "../../../core/api/hooks/useLocalUploader";
import { Module } from "../../../core/common/data/interface";

const AddNewCourse = () => {
  const {
    uploadVideo,
    uploadThumbnail,
    thumbnailPreview,
    selectThumbnail,
    processCurriculum,
    uploadProgressMap,
    uploading
  } = useLocalUploader();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [level, setLevel] = useState<string | number>("");
  const [language, setLanguage] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [progressMessage, setProgressMessage] = useState<string>("Iniciando...");
  const [showSuccess, setShowSuccess] = useState(false);

  const [publicOrPrivate, setPublicOrPrivate] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [courseId, setCourseId] = useState(null);
  const [introVideo, setintroVideo] = useState("");
  const [videoProvider, setVideoProvider] = useState("local");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [submitMessages, setSubmitMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [message, setMessages] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [introductionVideo, setIntroVideo] = useState<File | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      selectThumbnail(file);
    }
  };

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [curriculum, setCurriculum] = useState<Module[]>([
    {
      title: "",
      description: "",
      lessons: [{ title: "", content: null as any }],
    },
  ]);

  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPrice, setDiscountPrice] = useState("");
  const [show, setShow] = useState(false);
  const [expiryType, setExpiryType] = useState<"LIFETIME" | "LIMITED_TIME">("LIFETIME");
  const [expiryMonths, setExpiryMonths] = useState("");

  const addModule = () => {
    setCurriculum([
      ...curriculum,
      { title: "", description: "", lessons: [{ title: "", content: "" }] },
    ]);
  };

  const removeModule = (index: number) => {
    const updated = curriculum.filter((_, i) => i !== index);
    setCurriculum(updated);
  };

  const updateModuleTitle = (index: number, value: string) => {
    const updated = [...curriculum];
    updated[index].title = value;
    setCurriculum(updated);
  };

  const updateModuleDescription = (index: number, value: string) => {
    const updated = [...curriculum];
    updated[index].description = value;
    setCurriculum(updated);
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons.push({ title: "", content: "" });
    setCurriculum(updated);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setCurriculum(updated);
  };

  const updateLessonTitle = (
    moduleIndex: number,
    lessonIndex: number,
    value: string
  ) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons[lessonIndex].title = value;
    setCurriculum(updated);
  };

  const updateLessonContent = (
    moduleIndex: number,
    lessonIndex: number,
    value: any
  ) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons[lessonIndex].content = value;
    setCurriculum(updated);
  };

  const levelMap = {
    BEGINNER: "Iniciante",
    INTERMEDIATE: "Intermediário",
    ADVANCED: "Avançado",
    EXPERT: "Especialista",
  };

  const route = all_routes;
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const addNewItem = () => {
    setItems([...items, ""]);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const updateRequirement = (index: number, value: string) => {
    const newItems = [...requirements];
    newItems[index] = value;
    setRequirements(newItems);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const {
    saveBasicInfo,
    getCategories,
    saveMedia,
    saveCurriculum,
    savePricing,
  } = useCourseApi();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error: any) {
        console.error(
          "Erro ao buscar categorias:",
          error.response?.data || error.message
        );
      }
    };

    fetchCategories();
  }, []);

  const validateStep1 = () => {
    setShow(false);
    if (
      !title.trim() ||
      !categoryId ||
      !level ||
      !language.trim() ||
      !maxStudents.trim() ||
      !publicOrPrivate.trim() ||
      !shortDescription.trim() ||
      !longDescription.trim() ||
      items.length === 0 ||
      requirements.length === 0
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!introductionVideo || !thumbnailFile) {
      toast.error("Por favor, faça upload da thumbnail e do vídeo de introdução.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const isValid = curriculum.every((mod) => mod.title.trim() !== "");
    if (!isValid) {
      toast.error("Todos os módulos precisam ter um título.");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!isFree) {
      if (!price || isNaN(Number(price))) {
        toast.warn("Por favor, preencha um preço válido.");
        return false;
      }
      if (hasDiscount && (!discountPrice || isNaN(Number(discountPrice)))) {
        toast.warn("Por favor, preencha um preço de desconto válido.");
        return false;
      }
      if (
        expiryType === "LIMITED_TIME" &&
        (!expiryMonths || isNaN(Number(expiryMonths)))
      ) {
        toast.warn("Por favor, preencha um número de meses válido.");
        return false;
      }
    }
    return true;
  };

  const handleStepValidationAndProceed = (currentStep: number) => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;

    handleNext();
  };

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveEntireCourse = async () => {
    setShowSuccess(false);
    setProgressMessage("Iniciando processo...");
    setIsLoading(true);
    setShow(true);

    try {
      setProgressMessage("Salvando informações básicas...");
      const newId = courseId ? courseId : null;

      const courseData = {
        title,
        categoryId,
        level,
        courseId: newId,
        language,
        maxStudents: parseInt(maxStudents, 10),
        publicOrPrivate,
        shortDescription,
        longDescription,
        whatStudentsWillLearn: items,
        requirements,
      };

      const basicRes = await saveBasicInfo(courseData);
      const newCourseId = basicRes.data?.courseId;
      setCourseId(newCourseId || null);

      // UPLOAD DA THUMBNAIL usando a nova API local
      setProgressMessage("Fazendo upload da thumbnail...");
      let thumbnailUrl = "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
        setThumbnailPath(thumbnailUrl);
      }

      // UPLOAD DO VÍDEO DE INTRODUÇÃO usando a nova API local
      setProgressMessage("Fazendo upload do vídeo de introdução...");
      let introVideoUrl = "";
      if (introductionVideo) {
        introVideoUrl = await uploadVideo(introductionVideo);
        setintroVideo(introVideoUrl);
      }

      // SALVA MÍDIA
      const mediaData = {
        introVideoUrl,
        videoProvider: "local",
        thumbnailPath: thumbnailUrl,
      };
      await saveMedia(newCourseId, mediaData);

      // PROCESSA CURRÍCULO usando a nova API local
      setProgressMessage("Fazendo upload das aulas...");
      const readyCurriculum = await processCurriculum(curriculum);
      
      setProgressMessage("Salvando currículo...");
      await saveCurriculum(newCourseId, readyCurriculum);

      // SALVA PREÇOS
      setProgressMessage("Salvando preço...");
      const pricingData = {
        free: isFree,
        price: isFree ? 0 : parseFloat(price),
        hasDiscount: isFree ? false : hasDiscount,
        discountPrice: isFree ? 0 : parseFloat(discountPrice),
        expiryType: isFree ? "LIFETIME" : expiryType,
        expiryMonths: isFree
          ? 0
          : expiryType === "LIMITED_TIME"
          ? parseInt(expiryMonths)
          : 0,
      };
      await savePricing(newCourseId, pricingData);

      setProgressMessage("✅ Curso salvo com sucesso!");
      setShowSuccess(true);
      toast.success("✅ Todas as etapas foram salvas com sucesso!");
      setIsLoading(false);
      setShow(false);
      handleNext();
      
    } catch (error: any) {
      setIsLoading(false);
      console.error("Erro ao salvar etapas:", error.response?.data || error.message);
      setMessages(
        error.response?.data?.message ||
          "Erro ao salvar o curso. Tente novamente."
      );
      toast.error(error.message || "Erro ao salvar o curso");
    }
  };

  // Função para mostrar progresso de upload
  const getUploadProgress = () => {
    const progresses = Object.values(uploadProgressMap);
    if (progresses.length === 0) return 0;
    return progresses.reduce((a, b) => a + b, 0) / progresses.length;
  };

  // Função para contar arquivos sendo enviados
  const getUploadingFilesCount = () => {
    return Object.keys(uploadProgressMap).length;
  };

  return (
    <>
      <Breadcrumb title="Add New Course" />

      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="add-course-item">
                <div className="wizard">
                  <ul className="form-wizard-steps" id="progressbar2">
                    <li
                      className={
                        currentStep === 1
                          ? "progress-active"
                          : currentStep > 1
                          ? "progress-activated"
                          : ""
                      }
                    >
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">01</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Informações do Curso</p>
                        </div>
                      </div>
                    </li>
                    <li
                      className={
                        currentStep === 2
                          ? "progress-active"
                          : currentStep > 2
                          ? "progress-activated"
                          : ""
                      }
                    >
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">02</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Mídia do Curso</p>
                        </div>
                      </div>
                    </li>
                    <li
                      className={
                        currentStep === 3
                          ? "progress-active"
                          : currentStep > 3
                          ? "progress-activated"
                          : ""
                      }
                    >
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">03</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Currículo</p>
                        </div>
                      </div>
                    </li>
                    <li
                      className={
                        currentStep === 4
                          ? "progress-active"
                          : currentStep > 4
                          ? "progress-activated"
                          : ""
                      }
                    >
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">04</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Precificação</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="initialization-form-set">
                  {currentStep === 1 && (
                    <fieldset
                      className="form-inner wizard-form-card"
                      id="first"
                    >
                      <div className="title">
                        <h5>Informações Básicas</h5>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="input-block">
                            <label className="form-label">
                              Título do Curso
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="input-block">
                            <label className="form-label">
                              Categoria do Curso
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <CustomSelect
                              options={categories.map((cat) => ({
                                value: cat.id,
                                label: cat.name,
                              }))}
                              className="select d-flex"
                              placeholder="Selecione"
                              value={
                                categoryId
                                  ? {
                                      value: categoryId,
                                      label:
                                        categories.find(
                                          (cat) => cat.id === categoryId
                                        )?.name || "Selecione",
                                    }
                                  : undefined
                              }
                              onChange={(selected) =>
                                setCategoryId(Number(selected.value))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="input-block">
                            <label className="form-label">
                              Nível do Curso
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <CustomSelect
                              options={[
                                { value: "BEGINNER", label: "Iniciante" },
                                {
                                  value: "INTERMEDIATE",
                                  label: "Intermediário",
                                },
                                { value: "ADVANCED", label: "Avançado" },
                                { value: "EXPERT", label: "Especialista" },
                              ]}
                              className="select d-flex"
                              placeholder="Selecione"
                              value={
                                level
                                  ? {
                                      value: level,
                                      label:
                                        levelMap[
                                          level as keyof typeof levelMap
                                        ] || "",
                                    }
                                  : undefined
                              }
                              onChange={(selected) =>
                                setLevel(String(selected.value))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="input-block">
                            <label className="form-label">
                              Idioma
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">
                              Número Máximo de Alunos
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control student-count"
                              value={maxStudents}
                              onChange={(e) => setMaxStudents(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">
                              Curso Público / Privado
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={publicOrPrivate}
                              onChange={(e) =>
                                setPublicOrPrivate(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-block">
                            <label className="form-label">
                              Descrição Curta
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={shortDescription}
                              onChange={(e) =>
                                setShortDescription(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-block">
                            <label className="form-label">
                              Descrição do Curso
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <div className="summernote">
                              <DefaultEditor
                                value={longDescription}
                                onChange={(e) =>
                                  setLongDescription(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="bg-light border p-4 rounded-3">
                            <h6 className="mb-2">
                              O que os alunos irão aprender?
                            </h6>
                            <div className="input-block" id="input-block">
                              {items.map((item, index) => (
                                <div
                                  key={index}
                                  className="d-flex align-items-center add-new-input"
                                >
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Digite o novo item"
                                    value={item}
                                    onChange={(e) =>
                                      updateItem(index, e.target.value)
                                    }
                                  />
                                  <Link
                                    to="#"
                                    className="link-trash"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeItem(index);
                                    }}
                                  >
                                    <i className="isax isax-trash" />
                                  </Link>
                                </div>
                              ))}
                            </div>
                            <div className="d-flex align-items-center justify-content-end">
                              <Link
                                to="#"
                                className="d-flex align-items-center add-new-topic"
                                id="add-new-topic-btn"
                                onClick={addNewItem}
                              >
                                <i className="isax isax-add me-1" /> Adicionar
                                Novo Item
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="bg-light border p-4 rounded-3">
                            <h6 className="mb-2">Requisitos</h6>
                            <div className="input-block">
                              {requirements.map((item, index) => (
                                <div
                                  key={index}
                                  className="d-flex align-items-center add-new-input"
                                >
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Digite o requisito"
                                    value={item}
                                    onChange={(e) =>
                                      updateRequirement(index, e.target.value)
                                    }
                                  />
                                  <Link
                                    to="#"
                                    className="link-trash"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeRequirement(index);
                                    }}
                                  >
                                    <i className="isax isax-trash" />
                                  </Link>
                                </div>
                              ))}
                            </div>
                            <div className="d-flex align-items-center justify-content-end">
                              <Link
                                to="#"
                                className="d-flex align-items-center add-new-topic"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addRequirement();
                                }}
                              >
                                <i className="isax isax-add me-1" /> Adicionar
                                Novo Item
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check form-switch form-check-md mb-0 mt-3">
                            <input
                              className="form-check-input form-checked-success"
                              type="checkbox"
                              id="checkFeature"
                              defaultChecked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkFeature"
                            >
                              Marque para destacar este curso
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="add-form-btn widget-next-btn submit-btn d-flex justify-content-end mb-0">
                        <div className="btn-left">
                          <Link
                            to="#"
                            className="btn main-btn next_btns"
                            onClick={() => handleStepValidationAndProceed(1)}
                          >
                            Próximo{" "}
                            <i className="isax isax-arrow-right-3 ms-1" />
                          </Link>
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {currentStep === 2 && (
                    <fieldset
                      className="form-inner wizard-form-card"
                      style={{ display: "block" }}
                    >
                      <div className="title">
                        <h5>Mídia do Curso</h5>
                        <p>
                          Visão geral introdutória do curso com tipo de
                          provedor. (.mp4, YouTube, Vimeo etc.)
                        </p>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="input-block">
                            <div className="row align-items-center">
                              <div className="col-md-12">
                                <label className="form-label">
                                  Miniatura do Curso
                                  <span className="text-danger ms-1">*</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div
                            className="upload-img-section d-flex align-items-center justify-content-center"
                            id="upload-img-section"
                            onClick={() => {
                              const input =
                                document.getElementById("upload-img-input");
                              input?.click();
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <input
                              type="file"
                              id="upload-img-input"
                              style={{ display: "none" }}
                              accept="image/jpeg, image/png, image/gif, image/webp"
                              onChange={handleThumbnailChange}
                            />
                            {thumbnailPreview ? (
                              <img
                                src={thumbnailPreview}
                                alt="Prévia da Miniatura"
                                style={{
                                  maxHeight: "150px",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <div className="upload-content">
                                <span className="d-flex align-items-center justify-content-center mb-1">
                                  <i className="isax isax-image5 text-secondary fs-24 text-center" />
                                </span>
                                <p className="text-center fw-medium mb-1">
                                  Enviar Imagem
                                </p>
                                <span className="text-center">
                                  Formatos JPEG, PNG, GIF e WebP, até 2 MB
                                </span>
                              </div>
                            )}
                          </div>

                          <hr className="mt-4 mb-4" />
                        </div>

                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="input-block-link">
                                <label className="form-label">
                                  Vídeo do Curso
                                  <span className="text-danger ms-1">*</span>
                                </label>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <label
                                htmlFor="file-upload"
                                className="file-upload-btn text-center"
                              >
                                Enviar Arquivo
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                name="file"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setIntroVideo(e.target.files[0]);
                                    setintroVideo(
                                      URL.createObjectURL(e.target.files[0])
                                    );
                                  }
                                }}
                                accept="video/*"
                                style={{ display: "none" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="position-relative">
                            <Link
                              to="#"
                              id="openVideoBtn"
                              onClick={handleOpenModal}
                            >
                              <ImageWithBasePath
                                className="img-fluid rounded"
                                src="./assets/img/course/add-course-1.jpg"
                                alt="img"
                              />
                              <div className="play-icon">
                                <i className="fa-solid fa-play" />
                              </div>
                            </Link>
                          </div>
                          <div id="videoModal">
                            <div className="modal-content1">
                              <span className="close-btn" id="closeModal">
                                ×
                              </span>
                              <VideoModal
                                show={showModal}
                                handleClose={handleCloseModal}
                                videoUrl={introVideo}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="add-form-btn widget-next-btn submit-btn">
                        <div className="btn-left">
                          <Link
                            to="#"
                            className="btn btn-light main-btn prev_btns d-flex align-items-center"
                            onClick={handlePrev}
                          >
                            <i className="isax isax-arrow-left-2 me-1" />
                            Anterior
                          </Link>
                        </div>
                        <div className="btn-left">
                          <Link
                            to="#"
                            className="btn btn-secondary main-btn next_btns d-flex align-items-center"
                            onClick={() => handleStepValidationAndProceed(2)}
                          >
                            Próximo
                            <i className="isax isax-arrow-right-3 ms-1" />
                          </Link>
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {currentStep === 3 && (
                    <fieldset
                      className="form-inner wizard-form-card"
                      style={{ display: "block" }}
                    >
                      <div className="title">
                        <div className="row align-items-center row-gap-2">
                          <div className="col-md-6">
                            <h5 className="mb-0">Currículo</h5>
                          </div>
                          <div className="col-md-6 text-md-end">
                            <Link
                              to="#"
                              className="btn add-edit-btn d-inline-flex align-items-center"
                              onClick={(e) => {
                                e.preventDefault();
                                addModule();
                              }}
                            >
                              <i className="isax isax-add-circle5 me-1" />{" "}
                              Adicionar Novo Tópico
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div
                          className="accordions-items-seperate"
                          id="accordionSpacingExample"
                        >
                          {curriculum.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="accordion-item">
                              <h2
                                className="accordion-header"
                                id={`headingSpacing${moduleIndex}`}
                              >
                                <Link
                                  to="#"
                                  className="accordion-button collapsed"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#Spacing${moduleIndex}`}
                                  aria-expanded="false"
                                  aria-controls={`Spacing${moduleIndex}`}
                                >
                                  <span className="d-flex align-items-center mb-0">
                                    <i className="isax isax-menu-15 me-2" />
                                    {module.title ||
                                      `Módulo ${moduleIndex + 1}`}
                                  </span>
                                </Link>
                              </h2>

                              <div
                                id={`Spacing${moduleIndex}`}
                                className="accordion-collapse collapse show"
                                aria-labelledby={`headingSpacing${moduleIndex}`}
                                data-bs-parent="#accordionSpacingExample"
                              >
                                <div className="accordion-body">
                                  <div className="input-block mb-3">
                                    <label className="form-label">
                                      Título do Módulo
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={module.title}
                                      onChange={(e) =>
                                        updateModuleTitle(
                                          moduleIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="input-block mb-3">
                                    <label className="form-label">
                                      Descrição do Módulo
                                    </label>
                                    <textarea
                                      className="form-control"
                                      value={module.description}
                                      onChange={(e) =>
                                        updateModuleDescription(
                                          moduleIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>

                                  {module.lessons.map(
                                    (lesson, lessonIndex) => (
                                      <div
                                        key={lessonIndex}
                                        className="d-flex align-items-center justify-content-between bg-white p-2 border rounded-3 mb-3"
                                      >
                                        <div
                                          className="d-flex flex-column w-100"
                                          style={{ position: "relative" }}
                                        >
                                          <div className="row align-items-center mb-3">
                                            <div className="col-md-10 position-relative">
                                              <input
                                                type="text"
                                                className="form-control pe-5"
                                                placeholder="Título da Aula"
                                                value={lesson.title}
                                                onChange={(e) =>
                                                  updateLessonTitle(
                                                    moduleIndex,
                                                    lessonIndex,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <label
                                                htmlFor={`upload-file-${moduleIndex}-${lessonIndex}`}
                                                style={{
                                                  position: "absolute",
                                                  right: "15px",
                                                  top: "50%",
                                                  transform:
                                                    "translateY(-50%)",
                                                  cursor: "pointer",
                                                  color: "#0d6efd",
                                                  fontWeight: "bold",
                                                  userSelect: "none",
                                                }}
                                                title="Enviar Arquivo (Vídeo ou PDF)"
                                              >
                                                📤
                                              </label>
                                              <input
                                                id={`upload-file-${moduleIndex}-${lessonIndex}`}
                                                type="file"
                                                accept="video/*,application/pdf"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                  const file =
                                                    e.target.files?.[0];
                                                  if (!file) return;
                                                  updateLessonContent(
                                                    moduleIndex,
                                                    lessonIndex,
                                                    file
                                                  );
                                                }}
                                              />
                                            </div>

                                            <div className="col-md-2 text-end">
                                              <Link
                                                to="#"
                                                className="delete-btn1"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  removeLesson(
                                                    moduleIndex,
                                                    lessonIndex
                                                  );
                                                }}
                                                title="Excluir Aula"
                                              >
                                                <i className="isax isax-trash fs-16" />
                                              </Link>
                                            </div>
                                          </div>

                                          {lesson.content ? (
                                            <div>
                                              {lesson.content instanceof
                                                File &&
                                              lesson.content.type.startsWith(
                                                "video/"
                                              ) ? (
                                                <video
                                                  src={URL.createObjectURL(
                                                    lesson.content
                                                  )}
                                                  controls
                                                  style={{
                                                    maxWidth: "300px",
                                                    marginTop: "10px",
                                                    borderRadius: "8px",
                                                  }}
                                                />
                                              ) : null}

                                              {lesson.content instanceof
                                                File &&
                                              lesson.content.type ===
                                                "application/pdf" ? (
                                                <object
                                                  data={URL.createObjectURL(
                                                    lesson.content
                                                  )}
                                                  type="application/pdf"
                                                  width="100%"
                                                  height="500px"
                                                  style={{
                                                    marginTop: "10px",
                                                    borderRadius: "8px",
                                                  }}
                                                >
                                                  <p>
                                                    Seu navegador não suporta
                                                    visualização de PDFs.{" "}
                                                    <a
                                                      href={URL.createObjectURL(
                                                        lesson.content
                                                      )}
                                                    >
                                                      Baixe o PDF
                                                    </a>
                                                    .
                                                  </p>
                                                </object>
                                              ) : null}
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    )
                                  )}

                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                      <Link
                                        to="#"
                                        className="btn btn-primary d-inline-flex align-items-center"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          addLesson(moduleIndex);
                                        }}
                                      >
                                        <i className="isax isax-add-circle5 me-2" />
                                        Adicionar Aula
                                      </Link>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <Link
                                        to="#"
                                        className="btn btn-danger d-inline-flex align-items-center"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          removeModule(moduleIndex);
                                        }}
                                      >
                                        <i className="isax isax-trash me-2" />
                                        Remover Módulo
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="add-form-btn widget-next-btn submit-btn">
                        <div className="btn-left">
                          <Link
                            to="#"
                            className="btn btn-light main-btn prev_btns"
                            onClick={handlePrev}
                          >
                            <i className="isax isax-arrow-left-2 me-1" />
                            Anterior
                          </Link>
                        </div>
                        <div className="btn-left">
                          <Link
                            to="#"
                            className="btn btn-secondary main-btn next_btns"
                            onClick={() => handleStepValidationAndProceed(3)}
                          >
                            Próximo
                            <i className="isax isax-arrow-right-3 ms-1" />
                          </Link>
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {currentStep === 4 && (
                    <fieldset
                      className="form-inner wizard-form-card"
                      style={{ display: "block" }}
                    >
                      <div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="form-check form-check-md d-flex align-items-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckChecked1"
                              checked={isFree}
                              onChange={() => setIsFree(!isFree)}
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="flexCheckChecked1"
                            >
                              Marque se este for um curso gratuito
                            </label>
                          </div>
                        </div>

                        <div className="input-block mb-2">
                          <label className="form-label">
                            Preço do Curso (MZN)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={price}
                            disabled={isFree}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>

                        <div className="d-flex align-items-center mb-3">
                          <div className="form-check form-check-md d-flex align-items-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckChecked2"
                              checked={hasDiscount}
                              disabled={isFree}
                              onChange={() => setHasDiscount(!hasDiscount)}
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="flexCheckChecked2"
                            >
                              Marque se este curso tem desconto
                            </label>
                            </div>
                        </div>

                        <div className="input-block">
                          <label className="form-label">
                            Preço com Desconto (MZN)
                          </label>
                          <input
                            type="text"
                            className="form-control mb-1"
                            value={discountPrice}
                            disabled={isFree || !hasDiscount}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="form-label mb-1">
                            Período de Acesso
                          </label>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioExpiry"
                                id="flexRadioLifetime"
                                checked={expiryType === "LIFETIME"}
                                disabled={isFree}
                                onChange={() => setExpiryType("LIFETIME")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioLifetime"
                              >
                                Vitalício
                              </label>
                            </div>
                            <div className="form-check me-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioExpiry"
                                id="flexRadioLimited"
                                checked={expiryType === "LIMITED_TIME"}
                                disabled={isFree}
                                onChange={() => setExpiryType("LIMITED_TIME")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioLimited"
                              >
                                Tempo Limitado
                              </label>
                            </div>
                          </div>
                        </div>

                        {expiryType === "LIMITED_TIME" && !isFree && (
                          <div className="input-block">
                            <label className="form-label">
                              Número de meses
                            </label>
                            <input
                              type="text"
                              className="form-control mb-1"
                              value={expiryMonths}
                              onChange={(e) =>
                                setExpiryMonths(e.target.value)
                              }
                            />
                            <span>
                              Após a compra, os alunos terão acesso ao curso
                              pelo tempo selecionado.
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="add-form-btn widget-next-btn submit-btn">
                        <div className="btn-left">
                          <Link
                            to="#"
                            className="btn btn-light main-btn prev_btns"
                            onClick={handlePrev}
                          >
                            <i className="isax isax-arrow-left-2 me-1" />
                            Anterior
                          </Link>
                        </div>
                        <div className="btn-left">
                          <Link
                            to="#"
                            className="btn btn-secondary main-btn next_btns"
                            onClick={handleSaveEntireCourse}
                          >
                            Enviar Curso
                          </Link>
                        </div>
                      </div>
                    </fieldset>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body className="p-4 text-center">
          {uploading ? (
            <>
              <div className="spinner-border text-primary mb-3" role="status" />
              <h3 className="mb-2">
                {progressMessage || "A submeter o curso..."}
              </h3>
              <ProgressBar
                now={getUploadProgress()}
                label={`${Math.round(getUploadProgress())}%`}
                animated
                striped
              />
              <p className="mt-2">
                {getUploadingFilesCount() > 0 && 
                 `Upload de ${getUploadingFilesCount()} arquivo(s) em progresso...`}
              </p>
              <small className="text-muted">
                Aguarde enquanto os arquivos de mídia são enviados...
              </small>
            </>
          ) : (
            <>
              <div className="text-success h1 mb-2">
                <i className="isax isax-tick-circle5" />
              </div>
              <h5 className="mb-2">Parabéns! Curso Submetido</h5>
              <p className="mb-3">
                O seu curso foi submetido com sucesso e está em fase de revisão.
                Assim que for aprovado, será publicado automaticamente.
              </p>
              <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                <Link
                  to={route.instructorDashboard}
                  className="btn btn-secondary"
                >
                  <i className="isax isax-arrow-left-2 me-1" />
                  Voltar ao Painel
                </Link>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddNewCourse;