import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Instagram,
  DollarSign,
  Home,
  User,
  Music,
  MapPin as Location,
  Edit,
  Trash2,
  Clock,
  Users,
  ThumbsUp,
  Camera,
} from "lucide-react";
import { Profile, User as UserType } from "../types";
import { MediaSlider } from "./MediaSlider";
import { ShareButton } from "./ShareButton";
import { CommentsSection } from "./CommentsSection";
import { getTimeAgo } from "../utils/dateUtils";

interface ProfileDetailProps {
  profile: Profile;
  currentUser: UserType | null;
  onBack: () => void;
  onEdit?: (profile: Profile) => void;
  onDelete?: (profile: Profile) => void;
  onToggleLike?: (profileId: string) => void;
  blurImages?: boolean;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({
  profile,
  currentUser,
  onBack,
  onEdit,
  onDelete,
  onToggleLike,
  blurImages = false,
}) => {
  const [showFullscreenSlider, setShowFullscreenSlider] = useState(false);

  // Verificar permisos de edición/eliminación
  const canEdit = () => {
    if (!currentUser) return false;
    
    // Los administradores pueden editar cualquier perfil
    if (currentUser.role === 'admin') return true;
    
    // Los usuarios solo pueden editar perfiles que ellos crearon
    if (profile.createdByUser?.id === currentUser.id) return true;
    
    return false;
  };

  // Combinar fotos y videos en un solo array de media
  const allMedia = [
    ...profile.photos.map((url) => ({ url, type: "photo" as const })),
    ...profile.videos.map((url) => ({ url, type: "video" as const })),
  ];

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(profile);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(profile);
    }
  };

  const timeAgo = getTimeAgo(profile.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900/20">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al catálogo</span>
            </button>

            {/* Action buttons - Solo iconos con fondo negro elegante */}
            <div className="flex items-center space-x-3">
              <ShareButton
                profile={{
                  id: profile.id,
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  photos: profile.photos,
                  videos: profile.videos,
                  age: profile.age,
                  residence: profile.residence,
                }}
              />
              {onEdit && canEdit() && (
                <button
                  onClick={handleEditClick}
                  className="p-3 bg-black/80 hover:bg-black/90 backdrop-blur-sm border border-gray-600 hover:border-gray-500 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                  title="Editar perfil"
                >
                  <Edit className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </button>
              )}
              {onDelete && canEdit() && (
                <button
                  onClick={handleDeleteClick}
                  className="p-3 bg-black/80 hover:bg-black/90 backdrop-blur-sm border border-gray-600 hover:border-red-500 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                  title="Eliminar perfil"
                >
                  <Trash2 className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Section */}
          <div className="space-y-4">
            {/* Main media on mobile, hidden on desktop */}
            <div className="lg:hidden">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden">
                <MediaSlider media={allMedia} autoPlay={false} blurImages={blurImages} />
              </div>
            </div>

            {/* Auto-sliding media on desktop */}
            <div className="hidden lg:block h-[600px] rounded-2xl overflow-hidden">
              <MediaSlider media={allMedia} autoPlay={true} interval={4000} blurImages={blurImages} />
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <div className="flex flex-row sm:items-center gap-2 sm:gap-4 text-gray-300 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{profile.age} años</span>
                    </div>
                    {profile.residence && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.residence}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Botón de like en móvil - aparece aquí cuando no hay espacio arriba */}
                  <div className="block sm:hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleLike) {
                          console.log('ProfileDetail: Click en like, perfil:', profile.id, 'isLiked:', profile.isLikedByCurrentUser);
                          onToggleLike(profile.id);
                        }
                      }}
                      className={`relative p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        profile.isLikedByCurrentUser
                          ? "bg-red-600 text-white shadow-lg scale-110"
                          : "bg-gray-800/50 text-gray-300 hover:bg-red-600/70 hover:text-white border border-gray-600 hover:border-red-500"
                      }`}
                      title={
                        profile.isLikedByCurrentUser
                          ? "Quitar me gusta"
                          : "Me gusta"
                      }
                      disabled={!onToggleLike}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          profile.isLikedByCurrentUser ? "fill-current" : ""
                        }`}
                      />
                      {profile.likesCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold shadow-lg">
                          {profile.likesCount > 99 ? "99+" : profile.likesCount}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Botón de like en desktop - siempre visible al lado */}
                <div className="hidden sm:block">
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleLike) {
                      console.log('ProfileDetail: Click en like, perfil:', profile.id, 'isLiked:', profile.isLikedByCurrentUser);
                      onToggleLike(profile.id);
                    }
                  }}
                  className={`relative p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    profile.isLikedByCurrentUser
                      ? "bg-red-600 text-white shadow-lg scale-110"
                      : "bg-gray-800/50 text-gray-300 hover:bg-red-600/70 hover:text-white border border-gray-600 hover:border-red-500"
                  }`}
                  title={
                    profile.isLikedByCurrentUser
                      ? "Quitar me gusta"
                      : "Me gusta"
                  }
                  disabled={!onToggleLike}
                  >
                  <Heart
                    className={`w-5 h-5 ${
                      profile.isLikedByCurrentUser ? "fill-current" : ""
                    }`}
                  />
                  {profile.likesCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold shadow-lg">
                      {profile.likesCount > 99 ? "99+" : profile.likesCount}
                    </div>
                  )}
                  </button>
                </div>
              </div>

              {/* Media count and creation date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-gray-400 text-sm">
                <div className="flex items-center space-x-1">
                  <Camera className="w-4 h-4 rotate-180" />
                  <span>
                    {profile.photos.length} fotos • {profile.videos.length}{" "}
                    videos
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex flex-row sm:items-center gap-2 sm:gap-2 min-w-0 flex-1">
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:from-pink-700 hover:to-purple-700 transition-colors text-sm sm:text-base min-w-0"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="truncate">{profile.instagram}</span>
                    </a>
                  )}
                  <div
                    className={`flex-shrink-0 flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                      profile.isAvailable !== false
                        ? "bg-green-600/20 text-green-300 border border-green-600/30"
                        : "bg-red-600/20 text-red-300 border border-red-600/30"
                    }`}
                  >
                    <span className="text-lg">
                      {profile.isAvailable !== false ? "😏" : "😔"}
                    </span>
                    <span>
                      {profile.isAvailable !== false
                        ? "Disponible"
                        : "No disponible"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 text-gray-400 text-sm">
                {profile.createdByUser && (
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>@{profile.createdByUser.username}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Creado {timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Economic Situation */}
            {(profile.netSalary || profile.fatherJob || profile.motherJob) && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Situación Económica</span>
                </h3>
                <div className="space-y-3">
                  {profile.netSalary && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Salario neto:</span>
                      <span className="text-white font-medium flex items-center space-x-1">
                        <span className="text-white">RD$</span>
                        <span>
                          {Number(
                            profile.netSalary.replace(/[^\d]/g, "")
                          ).toLocaleString("es-DO")}
                        </span>
                      </span>
                    </div>
                  )}
                  {profile.fatherJob && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trabajo del padre:</span>
                      <span className="text-white font-medium">
                        {profile.fatherJob}
                      </span>
                    </div>
                  )}
                  {profile.motherJob && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Trabajo de la madre:
                      </span>
                      <span className="text-white font-medium">
                        {profile.motherJob}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Physical Characteristics */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Características Físicas</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Altura</div>
                  <div className="text-white font-medium">{profile.height}</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Culo</div>
                  <div className="text-white font-medium">
                    {profile.bodySize}
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Teta</div>
                  <div className="text-white font-medium">
                    {profile.bustSize}
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Piel</div>
                  <div className="text-white font-medium">
                    {profile.skinColor}
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Ubicación</span>
              </h3>
              <div className="space-y-3">
                {profile.nationality && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nacionalidad:</span>
                    <span className="text-white font-medium">
                      {profile.nationality}
                    </span>
                  </div>
                )}
                {profile.residence && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Residencia:</span>
                    <span className="text-white font-medium">
                      {profile.residence}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Vive:</span>
                  <span className="text-white font-medium">
                    {profile.livingWith}
                  </span>
                </div>
              </div>
            </div>

            {/* Gustos e Intereses */}
            {(profile.musicTags.length > 0 || profile.placeTags.length > 0) && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-red-300 mb-6 flex items-center space-x-2">
                  <Heart className="w-5 h-5 fill-current" />
                  <span>Gustos Personales</span>
                </h3>

                <div className="space-y-6">
                  {/* Music Tags */}
                  {profile.musicTags.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                        <Music className="w-4 h-4 text-red-400" />
                        <span>Música Favorita</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.musicTags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-red-800/40 to-red-700/40 text-red-200 px-3 py-2 rounded-full text-sm border border-red-700/30 backdrop-blur-sm"
                          >
                            🎵 {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Place Tags */}
                  {profile.placeTags.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                        <Location className="w-4 h-4 text-red-400" />
                        <span>Lugares Favoritos</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.placeTags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-purple-800/40 to-purple-700/40 text-purple-200 px-3 py-2 rounded-full text-sm border border-purple-700/30 backdrop-blur-sm"
                          >
                            📍 {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección de Me Gusta */}
            {profile.likesCount > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Usuarios interesados</span>
                </h3>

                {profile.likedByUsers.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profile.likedByUsers.slice(0, 6).map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate">
                              {user.fullName}
                            </div>
                            <div className="text-gray-400 text-sm">
                              @{user.username}
                            </div>
                          </div>
                          {user.role === "admin" && (
                            <div className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                              Admin
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {profile.likedByUsers.length > 6 && (
                      <div className="text-center">
                        <div className="text-gray-400 text-sm">
                          Y {profile.likedByUsers.length - 6} personas más...
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      Los usuarios que dieron me gusta aparecerán aquí
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="mt-8">
          <CommentsSection profileId={profile.id} currentUser={currentUser} />
        </div>
      </div>

      {/* Fullscreen Media Slider */}
      {showFullscreenSlider && (
        <MediaSlider
          media={allMedia}
          onClose={() => setShowFullscreenSlider(false)}
          fullscreen={true}
          blurImages={blurImages}
        />
      )}
    </div>
  );
};