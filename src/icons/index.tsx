// Import all icons
import PeanutIcon from "./peanut.svg?raw";
import BananaIcon from "./banana.svg?raw";
import YipYap from "./yipyap.svg?raw";
import HomeIcon from "@fluentui/svg-icons/icons/home_24_regular.svg?raw";
import SunIcon from "@fluentui/svg-icons/icons/weather_sunny_24_regular.svg?raw";
import CloudIcon from "@fluentui/svg-icons/icons/weather_cloudy_24_regular.svg?raw";
import MoonIcon from "@fluentui/svg-icons/icons/weather_moon_24_regular.svg?raw";
import FolderIcon from "@fluentui/svg-icons/icons/folder_24_regular.svg?raw";
import UpIcon from "@fluentui/svg-icons/icons/location_arrow_up_20_regular.svg?raw";
import TagIcon from "@fluentui/svg-icons/icons/tag_24_regular.svg?raw";
import NotepadIcon from "@fluentui/svg-icons/icons/notepad_24_regular.svg?raw";
import SubtitlesIcon from "@fluentui/svg-icons/icons/subtitles_24_regular.svg?raw";
import EditIcon from "@fluentui/svg-icons/icons/edit_24_regular.svg?raw";
import SuccessIcon from "@fluentui/svg-icons/icons/checkmark_24_regular.svg?raw";
import QuestionIcon from "@fluentui/svg-icons/icons/question_circle_24_regular.svg?raw";
import InfoIcon from "@fluentui/svg-icons/icons/info_24_regular.svg?raw";
import WarningIcon from "@fluentui/svg-icons/icons/warning_24_regular.svg?raw";
import ErrorIcon from "@fluentui/svg-icons/icons/error_circle_24_regular.svg?raw";
import SizeIcon from "@fluentui/svg-icons/icons/data_usage_24_regular.svg?raw";
import TimeIcon from "@fluentui/svg-icons/icons/calendar_24_regular.svg?raw";
import TypeIcon from "@fluentui/svg-icons/icons/document_24_regular.svg?raw";
// This is the image icon, super unintuitive name >:3
import DimensionsIcon from "@fluentui/svg-icons/icons/image_24_regular.svg?raw";
import DownloadIcon from "@fluentui/svg-icons/icons/arrow_download_24_regular.svg?raw";
import DeleteIcon from "@fluentui/svg-icons/icons/delete_24_regular.svg?raw";
import DismissIcon from "@fluentui/svg-icons/icons/dismiss_24_regular.svg?raw";
import SpinnerIcon from "@fluentui/svg-icons/icons/spinner_ios_20_regular.svg?raw";
import BowTieIcon from "@fluentui/svg-icons/icons/bow_tie_24_regular.svg?raw";
import SparkleIcon from "@fluentui/svg-icons/icons/text_effects_sparkle_24_regular.svg?raw";
import TextAlignIcon from "@fluentui/svg-icons/icons/text_align_distributed_vertical_24_regular.svg?raw";
import TextAlignDistributedIcon from "@fluentui/svg-icons/icons/text_align_distributed_evenly_24_regular.svg?raw";
import ArrowUndoIcon from "@fluentui/svg-icons/icons/arrow_undo_24_regular.svg?raw";
import SettingsIcon from "@fluentui/svg-icons/icons/settings_24_regular.svg?raw";
import SearchIcon from "@fluentui/svg-icons/icons/search_24_regular.svg?raw";
import SpeakerIcon from "@fluentui/svg-icons/icons/speaker_2_24_regular.svg?raw";
import FolderArrowUpRegular from "@fluentui/svg-icons/icons/folder_arrow_up_24_regular.svg?raw";
import StrawberryIcon from "./strawberry.svg?raw";
import BookQuestionMarkRegular from "@fluentui/svg-icons/icons/book_question_mark_24_regular.svg?raw";
import GridRegular from "@fluentui/svg-icons/icons/grid_24_regular.svg?raw";
import ListRegular from "@fluentui/svg-icons/icons/list_24_regular.svg?raw";
import TextSortAscendingRegular from "@fluentui/svg-icons/icons/text_sort_ascending_24_regular.svg?raw";
import CalendarDateRegular from "@fluentui/svg-icons/icons/calendar_date_24_regular.svg?raw";
import DocumentArrowDownRegular from "@fluentui/svg-icons/icons/document_arrow_down_24_regular.svg?raw";
import PlusIcon from "@fluentui/svg-icons/icons/add_24_regular.svg?raw";

export const captionIconsMap = {
  txt: "notepad",
  tags: "tag",
  caption: "subtitles",
  wd: "bowtie",
};

export const statusIconsMap = {
  success: "success",
  question: "question",
  info: "info",
  warning: "warning",
  error: "error",
};

export const themeIconMap = {
  light: "sun",
  gray: "cloud",
  dark: "moon",
  banana: "banana",
  strawberry: "strawberry",
  peanut: "peanut",
};

const iconMap: Readonly<Record<string, string>> = {
  peanut: PeanutIcon,
  banana: BananaIcon,
  strawberry: StrawberryIcon,
  yipyap: YipYap,
  home: HomeIcon,
  sun: SunIcon,
  cloud: CloudIcon,
  moon: MoonIcon,
  folder: FolderIcon,
  up: UpIcon,
  tag: TagIcon,
  notepad: NotepadIcon,
  subtitles: SubtitlesIcon,
  edit: EditIcon,
  success: SuccessIcon,
  question: QuestionIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  size: SizeIcon,
  time: TimeIcon,
  type: TypeIcon,
  dimensions: DimensionsIcon,
  download: DownloadIcon,
  delete: DeleteIcon,
  dismiss: DismissIcon,
  spinner: SpinnerIcon,
  bowtie: BowTieIcon,
  sparkle: SparkleIcon,
  textAlign: TextAlignIcon,
  textAlignDistributed: TextAlignDistributedIcon,
  arrowUndo: ArrowUndoIcon,
  settings: SettingsIcon,
  search: SearchIcon,
  speaker: SpeakerIcon,
  folderArrowUp: FolderArrowUpRegular,
  bookQuestionMark: BookQuestionMarkRegular,
  grid: GridRegular,
  list: ListRegular,
  textSortAscending: TextSortAscendingRegular,
  calendarDate: CalendarDateRegular,
  documentArrowDown: DocumentArrowDownRegular,
  plus: PlusIcon,
};

/* Returns a SVGElement from the icon map */
export const getIcon = (name: keyof typeof iconMap): SVGElement => {
  let icon = iconCache.get(name);
  if (icon !== undefined) {
    return icon.cloneNode(true) as SVGElement;
  }

  const svg_str = iconMap[name];
  if (!svg_str) {
    throw new Error(`Icon ${name} not found`);
  }

  offscreen.innerHTML = svg_str;
  icon = offscreen.children[0] as any as SVGElement;
  iconCache.set(name, icon);
  return icon;
};
export default getIcon;

const iconCache = new Map<string, SVGElement>();
const offscreen = document.createElement("span");
