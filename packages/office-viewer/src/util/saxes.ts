/**
 * 来自 https://github.com/lddubeau/saxes，修了些类型报错，后续优化性能
 */

import * as ed5 from './xmlchars/xml/1.0/ed5';
import * as ed2 from './xmlchars/xml/1.1/ed2';
import * as NSed3 from './xmlchars/xmlns/1.0/ed3';

import isS = ed5.isS;
import isChar10 = ed5.isChar;
import isNameStartChar = ed5.isNameStartChar;
import isNameChar = ed5.isNameChar;
import S_LIST = ed5.S_LIST;
import NAME_RE = ed5.NAME_RE;

import isChar11 = ed2.isChar;

import isNCNameStartChar = NSed3.isNCNameStartChar;
import isNCNameChar = NSed3.isNCNameChar;
import NC_NAME_RE = NSed3.NC_NAME_RE;

const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
const XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/';

const rootNS: Record<string, string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  __proto__: null as any,
  xml: XML_NAMESPACE,
  xmlns: XMLNS_NAMESPACE
};

const XML_ENTITIES: Record<string, string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  __proto__: null as any,
  amp: '&',
  gt: '>',
  lt: '<',
  quot: '"',
  apos: "'"
};

// EOC: end-of-chunk
const EOC = -1;
const NL_LIKE = -2;

const S_BEGIN = 0; // Initial state.
const S_BEGIN_WHITESPACE = 1; // leading whitespace
const S_DOCTYPE = 2; // <!DOCTYPE
const S_DOCTYPE_QUOTE = 3; // <!DOCTYPE "//blah
const S_DTD = 4; // <!DOCTYPE "//blah" [ ...
const S_DTD_QUOTED = 5; // <!DOCTYPE "//blah" [ "foo
const S_DTD_OPEN_WAKA = 6;
const S_DTD_OPEN_WAKA_BANG = 7;
const S_DTD_COMMENT = 8; // <!--
const S_DTD_COMMENT_ENDING = 9; // <!-- blah -
const S_DTD_COMMENT_ENDED = 10; // <!-- blah --
const S_DTD_PI = 11; // <?
const S_DTD_PI_ENDING = 12; // <?hi "there" ?
const S_TEXT = 13; // general stuff
const S_ENTITY = 14; // &amp and such
const S_OPEN_WAKA = 15; // <
const S_OPEN_WAKA_BANG = 16; // <!...
const S_COMMENT = 17; // <!--
const S_COMMENT_ENDING = 18; // <!-- blah -
const S_COMMENT_ENDED = 19; // <!-- blah --
const S_CDATA = 20; // <![CDATA[ something
const S_CDATA_ENDING = 21; // ]
const S_CDATA_ENDING_2 = 22; // ]]
const S_PI_FIRST_CHAR = 23; // <?hi, first char
const S_PI_REST = 24; // <?hi, rest of the name
const S_PI_BODY = 25; // <?hi there
const S_PI_ENDING = 26; // <?hi "there" ?
const S_XML_DECL_NAME_START = 27; // <?xml
const S_XML_DECL_NAME = 28; // <?xml foo
const S_XML_DECL_EQ = 29; // <?xml foo=
const S_XML_DECL_VALUE_START = 30; // <?xml foo=
const S_XML_DECL_VALUE = 31; // <?xml foo="bar"
const S_XML_DECL_SEPARATOR = 32; // <?xml foo="bar"
const S_XML_DECL_ENDING = 33; // <?xml ... ?
const S_OPEN_TAG = 34; // <strong
const S_OPEN_TAG_SLASH = 35; // <strong /
const S_ATTRIB = 36; // <a
const S_ATTRIB_NAME = 37; // <a foo
const S_ATTRIB_NAME_SAW_WHITE = 38; // <a foo _
const S_ATTRIB_VALUE = 39; // <a foo=
const S_ATTRIB_VALUE_QUOTED = 40; // <a foo="bar
const S_ATTRIB_VALUE_CLOSED = 41; // <a foo="bar"
const S_ATTRIB_VALUE_UNQUOTED = 42; // <a foo=bar
const S_CLOSE_TAG = 43; // </a
const S_CLOSE_TAG_SAW_WHITE = 44; // </a   >

const TAB = 9;
const NL = 0xa;
const CR = 0xd;
const SPACE = 0x20;
const BANG = 0x21;
const DQUOTE = 0x22;
const AMP = 0x26;
const SQUOTE = 0x27;
const MINUS = 0x2d;
const FORWARD_SLASH = 0x2f;
const SEMICOLON = 0x3b;
const LESS = 0x3c;
const EQUAL = 0x3d;
const GREATER = 0x3e;
const QUESTION = 0x3f;
const OPEN_BRACKET = 0x5b;
const CLOSE_BRACKET = 0x5d;
const NEL = 0x85;
const LS = 0x2028; // Line Separator

const isQuote = (c: number): boolean => c === DQUOTE || c === SQUOTE;

const QUOTES = [DQUOTE, SQUOTE];

const DOCTYPE_TERMINATOR = [...QUOTES, OPEN_BRACKET, GREATER];
const DTD_TERMINATOR = [...QUOTES, LESS, CLOSE_BRACKET];
const XML_DECL_NAME_TERMINATOR = [EQUAL, QUESTION, ...S_LIST];
const ATTRIB_VALUE_UNQUOTED_TERMINATOR = [...S_LIST, GREATER, AMP, LESS];

function nsPairCheck(
  parser: SaxesParser<SaxesOptions>,
  prefix: string,
  uri: string
): void {
  switch (prefix) {
    case 'xml':
      if (uri !== XML_NAMESPACE) {
        parser.fail(`xml prefix must be bound to ${XML_NAMESPACE}.`);
      }
      break;
    case 'xmlns':
      if (uri !== XMLNS_NAMESPACE) {
        parser.fail(`xmlns prefix must be bound to ${XMLNS_NAMESPACE}.`);
      }
      break;
    default:
  }

  switch (uri) {
    case XMLNS_NAMESPACE:
      parser.fail(
        prefix === ''
          ? `the default namespace may not be set to ${uri}.`
          : `may not assign a prefix (even "xmlns") to the URI \
${XMLNS_NAMESPACE}.`
      );
      break;
    case XML_NAMESPACE:
      switch (prefix) {
        case 'xml':
          // Assinging the XML namespace to "xml" is fine.
          break;
        case '':
          parser.fail(`the default namespace may not be set to ${uri}.`);
          break;
        default:
          parser.fail('may not assign the xml namespace to another prefix.');
      }
      break;
    default:
  }
}

function nsMappingCheck(
  parser: SaxesParser<SaxesOptions>,
  mapping: Record<string, string>
): void {
  for (const local of Object.keys(mapping)) {
    nsPairCheck(parser, local, mapping[local]);
  }
}

const isNCName = (name: string): boolean => NC_NAME_RE.test(name);

const isName = (name: string): boolean => NAME_RE.test(name);

const FORBIDDEN_START = 0;
const FORBIDDEN_BRACKET = 1;
const FORBIDDEN_BRACKET_BRACKET = 2;

/**
 * The list of supported events.
 */
export const EVENTS = [
  'xmldecl',
  'text',
  'processinginstruction',
  'doctype',
  'comment',
  'opentagstart',
  'attribute',
  'opentag',
  'closetag',
  'cdata',
  'error',
  'end',
  'ready'
] as const;

const EVENT_NAME_TO_HANDLER_NAME: Record<EventName, string> = {
  xmldecl: 'xmldeclHandler',
  text: 'textHandler',
  processinginstruction: 'piHandler',
  doctype: 'doctypeHandler',
  comment: 'commentHandler',
  opentagstart: 'openTagStartHandler',
  attribute: 'attributeHandler',
  opentag: 'openTagHandler',
  closetag: 'closeTagHandler',
  cdata: 'cdataHandler',
  error: 'errorHandler',
  end: 'endHandler',
  ready: 'readyHandler'
};

/**
 * Event handler for the
 *
 * @param text The text data encountered by the parser.
 *
 */
export type XMLDeclHandler = (decl: XMLDecl) => void;

/**
 * Event handler for text data.
 *
 * @param text The text data encountered by the parser.
 *
 */
export type TextHandler = (text: string) => void;

/**
 * Event handler for processing instructions.
 *
 * @param data The target and body of the processing instruction.
 */
export type PIHandler = (data: {target: string; body: string}) => void;

/**
 * Event handler for doctype.
 *
 * @param doctype The doctype contents.
 */
export type DoctypeHandler = (doctype: string) => void;

/**
 * Event handler for comments.
 *
 * @param comment The comment contents.
 */
export type CommentHandler = (comment: string) => void;

/**
 * Event handler for the start of an open tag. This is called as soon as we
 * have a tag name.
 *
 * @param tag The tag.
 */
export type OpenTagStartHandler<O extends SaxesOptions> = (
  tag: StartTagForOptions<O>
) => void;

export type AttributeEventForOptions<O extends SaxesOptions> = O extends {
  xmlns: true;
}
  ? SaxesAttributeNSIncomplete
  : O extends {xmlns?: false | undefined}
  ? SaxesAttributePlain
  : SaxesAttribute;

/**
 * Event handler for attributes.
 */
export type AttributeHandler<O extends SaxesOptions> = (
  attribute: AttributeEventForOptions<O>
) => void;

/**
 * Event handler for an open tag. This is called when the open tag is
 * complete. (We've encountered the ">" that ends the open tag.)
 *
 * @param tag The tag.
 */
export type OpenTagHandler<O extends SaxesOptions> = (
  tag: TagForOptions<O>
) => void;

/**
 * Event handler for a close tag. Note that for self-closing tags, this is
 * called right after ``opentag``.
 *
 * @param tag The tag.
 */
export type CloseTagHandler<O extends SaxesOptions> = (
  tag: TagForOptions<O>
) => void;

/**
 * Event handler for a CDATA section. This is called when ending the
 * CDATA section.
 *
 * @param cdata The contents of the CDATA section.
 */
export type CDataHandler = (cdata: string) => void;

/**
 * Event handler for the stream end. This is called when the stream has been
 * closed with ``close`` or by passing ``null`` to ``write``.
 */
export type EndHandler = () => void;

/**
 * Event handler indicating parser readiness . This is called when the parser
 * is ready to parse a new document.
 */
export type ReadyHandler = () => void;

/**
 * Event handler indicating an error.
 *
 * @param err The error that occurred.
 */
export type ErrorHandler = (err: Error) => void;

export type EventName = (typeof EVENTS)[number];
export type EventNameToHandler<O extends SaxesOptions, N extends EventName> = {
  xmldecl: XMLDeclHandler;
  text: TextHandler;
  processinginstruction: PIHandler;
  doctype: DoctypeHandler;
  comment: CommentHandler;
  opentagstart: OpenTagStartHandler<O>;
  attribute: AttributeHandler<O>;
  opentag: OpenTagHandler<O>;
  closetag: CloseTagHandler<O>;
  cdata: CDataHandler;
  error: ErrorHandler;
  end: EndHandler;
  ready: ReadyHandler;
}[N];

/**
 * This interface defines the structure of attributes when the parser is
 * processing namespaces (created with ``xmlns: true``).
 */
export interface SaxesAttributeNS {
  /**
   * The attribute's name. This is the combination of prefix and local name.
   * For instance ``a:b="c"`` would have ``a:b`` for name.
   */
  name: string;

  /**
   * The attribute's prefix. For instance ``a:b="c"`` would have ``"a"`` for
   * ``prefix``.
   */
  prefix: string;

  /**
   * The attribute's local name. For instance ``a:b="c"`` would have ``"b"`` for
   * ``local``.
   */
  local: string;

  /** The namespace URI of this attribute. */
  uri: string;

  /** The attribute's value. */
  value: string;
}

/**
 * This is an attribute, as recorded by a parser which parses namespaces but
 * prior to the URI being resolvable. This is what is passed to the attribute
 * event handler.
 */
export type SaxesAttributeNSIncomplete = Exclude<SaxesAttributeNS, 'uri'>;

/**
 * This interface defines the structure of attributes when the parser is
 * NOT processing namespaces (created with ``xmlns: false``).
 */
export interface SaxesAttributePlain {
  /**
   * The attribute's name.
   */
  name: string;

  /** The attribute's value. */
  value: string;
}

/**
 * A saxes attribute, with or without namespace information.
 */
export type SaxesAttribute = SaxesAttributeNS | SaxesAttributePlain;

/**
 * This are the fields that MAY be present on a complete tag.
 */
export interface SaxesTag {
  /**
   * The tag's name. This is the combination of prefix and global name. For
   * instance ``<a:b>`` would have ``"a:b"`` for ``name``.
   */
  name: string;

  /**
   * A map of attribute name to attributes. If namespaces are tracked, the
   * values in the map are attribute objects. Otherwise, they are strings.
   */
  attributes: Record<string, SaxesAttributeNS> | Record<string, string>;

  /**
   * The namespace bindings in effect.
   */
  ns?: Record<string, string>;

  /**
   * The tag's prefix. For instance ``<a:b>`` would have ``"a"`` for
   * ``prefix``. Undefined if we do not track namespaces.
   */
  prefix?: string;

  /**
   * The tag's local name. For instance ``<a:b>`` would
   * have ``"b"`` for ``local``. Undefined if we do not track namespaces.
   */
  local?: string;

  /**
   * The namespace URI of this tag. Undefined if we do not track namespaces.
   */
  uri?: string;

  /** Whether the tag is self-closing (e.g. ``<foo/>``). */
  isSelfClosing: boolean;
}

/**
 * This type defines the fields that are present on a tag object when
 * ``onopentagstart`` is called. This interface is namespace-agnostic.
 */
export type SaxesStartTag = Pick<SaxesTag, 'name' | 'attributes' | 'ns'>;

/**
 * This type defines the fields that are present on a tag object when
 * ``onopentagstart`` is called on a parser that does not processes namespaces.
 */
export type SaxesStartTagPlain = Pick<SaxesStartTag, 'name' | 'attributes'>;

/**
 * This type defines the fields that are present on a tag object when
 * ``onopentagstart`` is called on a parser that does process namespaces.
 */
export type SaxesStartTagNS = Required<SaxesStartTag>;

/**
 * This are the fields that are present on a complete tag produced by a parser
 * that does process namespaces.
 */
export type SaxesTagNS = Required<SaxesTag> & {
  attributes: Record<string, SaxesAttributeNS>;
};

/**
 * This are the fields that are present on a complete tag produced by a parser
 * that does not process namespaces.
 */
export type SaxesTagPlain = Pick<
  SaxesTag,
  'name' | 'attributes' | 'isSelfClosing'
> & {
  attributes: Record<string, string>;
};

// This is an internal type used for holding tags while they are being built.
type SaxesTagIncomplete = Omit<SaxesTag, 'isSelfClosing'> &
  Partial<Pick<SaxesTag, 'isSelfClosing'>>;

/**
 * An XML declaration.
 */
export interface XMLDecl {
  /** The version specified by the XML declaration. */
  version?: string;

  /** The encoding specified by the XML declaration. */
  encoding?: string;

  /** The value of the standalone parameter */
  standalone?: string;
}

/**
 * A callback for resolving name prefixes.
 *
 * @param prefix The prefix to check.
 *
 * @returns The URI corresponding to the prefix, if any.
 */
export type ResolvePrefix = (prefix: string) => string | undefined;

export interface CommonOptions {
  /** Whether to accept XML fragments. Unset means ``false``. */
  fragment?: boolean;

  /** Whether to track positions. Unset means ``true``. */
  position?: boolean;

  /**
   * A file name to use for error reporting. "File name" is a loose concept. You
   * could use a URL to some resource, or any descriptive name you like.
   */
  fileName?: string;
}

export interface NSOptions {
  /** Whether to track namespaces. Unset means ``false``. */
  xmlns?: boolean;

  /**
   * A plain object whose key, value pairs define namespaces known before
   * parsing the XML file. It is not legal to pass bindings for the namespaces
   * ``"xml"`` or ``"xmlns"``.
   */
  additionalNamespaces?: Record<string, string>;

  /**
   * A function that will be used if the parser cannot resolve a namespace
   * prefix on its own.
   */
  resolvePrefix?: ResolvePrefix;
}

export interface NSOptionsWithoutNamespaces extends NSOptions {
  xmlns?: false;
  // It makes no sense to set these if namespaces are not used.
  additionalNamespaces?: undefined;
  resolvePrefix?: undefined;
}

export interface NSOptionsWithNamespaces extends NSOptions {
  xmlns: true;
  // The other options are still optional.
}

export interface XMLVersionOptions {
  /**
   * The default XML version to use. If unspecified, and there is no XML
   * encoding declaration, the default version is "1.0".
   */
  defaultXMLVersion?: '1.0' | '1.1';

  /**
   * A flag indicating whether to force the XML version used for parsing to the
   * value of ``defaultXMLVersion``. When this flag is ``true``,
   * ``defaultXMLVersion`` must be specified. If unspecified, the default value
   * of this flag is ``false``.
   */
  forceXMLVersion?: boolean;
}

export interface NoForcedXMLVersion extends XMLVersionOptions {
  forceXMLVersion?: false;
  // defaultXMLVersion stays the same.
}

export interface ForcedXMLVersion extends XMLVersionOptions {
  forceXMLVersion: true;
  // defaultXMLVersion becomes mandatory.
  defaultXMLVersion: Exclude<XMLVersionOptions['defaultXMLVersion'], undefined>;
}

/**
 * The entire set of options supported by saxes.
 */
export type SaxesOptions = CommonOptions & NSOptions & XMLVersionOptions;

export type TagForOptions<O extends SaxesOptions> = O extends {xmlns: true}
  ? SaxesTagNS
  : O extends {xmlns?: false | undefined}
  ? SaxesTagPlain
  : SaxesTag;

export type StartTagForOptions<O extends SaxesOptions> = O extends {xmlns: true}
  ? SaxesStartTagNS
  : O extends {xmlns?: false | undefined}
  ? SaxesStartTagPlain
  : SaxesStartTag;

// eslint-disable-next-line @typescript-eslint/ban-types
export class SaxesParser<O extends SaxesOptions = {}> {
  private readonly fragmentOpt: boolean;
  private readonly xmlnsOpt: boolean;
  private readonly trackPosition: boolean;
  private readonly fileName?: string;
  private readonly nameStartCheck: (c: number) => boolean;
  private readonly nameCheck: (c: number) => boolean;
  private readonly isName: (name: string) => boolean;
  private readonly ns!: Record<string, string>;

  private openWakaBang!: string;
  private text!: string;
  private name!: string;
  private piTarget!: string;
  private entity!: string;
  private q!: null | number;
  private tags!: SaxesTagIncomplete[];
  private tag!: SaxesTagIncomplete | null;
  private topNS!: Record<string, string> | null;
  private chunk!: string;
  private chunkPosition!: number;
  private i!: number;

  //
  // We use prevI to allow "ungetting" the previously read code point. Note
  // however, that it is not safe to unget everything and anything. In
  // particular ungetting EOL characters will screw positioning up.
  //
  // Practically, you must not unget a code which has any side effect beyond
  // updating ``this.i`` and ``this.prevI``. Only EOL codes have such side
  // effects.
  //
  private prevI!: number;
  private carriedFromPrevious?: string;
  private forbiddenState!: number;
  private attribList!: (SaxesAttributeNSIncomplete | SaxesAttributePlain)[];
  private state!: number;
  private reportedTextBeforeRoot!: boolean;
  private reportedTextAfterRoot!: boolean;
  private closedRoot!: boolean;
  private sawRoot!: boolean;
  private xmlDeclPossible!: boolean;
  private xmlDeclExpects!: string[];
  private entityReturnState?: number;
  private processAttribs!: (this: this) => void;
  private positionAtNewLine!: number;
  private doctype!: boolean;
  private getCode!: () => number;
  private isChar!: (c: number) => boolean;
  private pushAttrib!: (name: string, value: string) => void;
  private _closed!: boolean;
  private currentXMLVersion!: string;
  private readonly stateTable: ((this: SaxesParser<O>) => void)[];
  private xmldeclHandler?: XMLDeclHandler;
  private textHandler?: TextHandler;
  private piHandler?: PIHandler;
  private doctypeHandler?: DoctypeHandler;
  private commentHandler?: CommentHandler;
  private openTagStartHandler?: OpenTagStartHandler<O>;
  private openTagHandler?: OpenTagHandler<O>;
  private closeTagHandler?: CloseTagHandler<O>;
  private cdataHandler?: CDataHandler;
  private errorHandler?: ErrorHandler;
  private endHandler?: EndHandler;
  private readyHandler?: ReadyHandler;
  private attributeHandler?: AttributeHandler<O>;

  /**
   * Indicates whether or not the parser is closed. If ``true``, wait for
   * the ``ready`` event to write again.
   */
  get closed(): boolean {
    return this._closed;
  }

  readonly opt: SaxesOptions;

  /**
   * The XML declaration for this document.
   */
  xmlDecl!: XMLDecl;

  /**
   * The line number of the next character to be read by the parser. This field
   * is one-based. (The first line is numbered 1.)
   */
  line!: number;

  /**
   * The column number of the next character to be read by the parser.  *
   * This field is zero-based. (The first column is 0.)
   *
   * This field counts columns by *Unicode character*. Note that this *can*
   * be different from the index of the character in a JavaScript string due
   * to how JavaScript handles astral plane characters.
   *
   * See [[columnIndex]] for a number that corresponds to the JavaScript index.
   */
  column!: number;

  /**
   * A map of entity name to expansion.
   */
  ENTITIES!: Record<string, string>;

  /**
   * @param opt The parser options.
   */
  constructor(opt?: O) {
    this.opt = opt ?? {};
    this.fragmentOpt = !!(this.opt.fragment as boolean);
    const xmlnsOpt = (this.xmlnsOpt = !!(this.opt.xmlns as boolean));
    this.trackPosition = this.opt.position !== false;
    this.fileName = this.opt.fileName;

    if (xmlnsOpt) {
      // This is the function we use to perform name checks on PIs and entities.
      // When namespaces are used, colons are not allowed in PI target names or
      // entity names. So the check depends on whether namespaces are used. See:
      //
      // https://www.w3.org/XML/xml-names-19990114-errata.html
      // NE08
      //
      this.nameStartCheck = isNCNameStartChar;
      this.nameCheck = isNCNameChar;
      this.isName = isNCName;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.processAttribs = this.processAttribsNS;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.pushAttrib = this.pushAttribNS;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      this.ns = {__proto__: null as any, ...rootNS};
      const additional = this.opt.additionalNamespaces;
      if (additional != null) {
        nsMappingCheck(this, additional);
        Object.assign(this.ns, additional);
      }
    } else {
      this.nameStartCheck = isNameStartChar;
      this.nameCheck = isNameChar;
      this.isName = isName;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.processAttribs = this.processAttribsPlain;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.pushAttrib = this.pushAttribPlain;
    }

    //
    // The order of the members in this table needs to correspond to the state
    // numbers given to the states that correspond to the methods being recorded
    // here.
    //
    this.stateTable = [
      /* eslint-disable @typescript-eslint/unbound-method */
      this.sBegin,
      this.sBeginWhitespace,
      this.sDoctype,
      this.sDoctypeQuote,
      this.sDTD,
      this.sDTDQuoted,
      this.sDTDOpenWaka,
      this.sDTDOpenWakaBang,
      this.sDTDComment,
      this.sDTDCommentEnding,
      this.sDTDCommentEnded,
      this.sDTDPI,
      this.sDTDPIEnding,
      this.sText,
      this.sEntity,
      this.sOpenWaka,
      this.sOpenWakaBang,
      this.sComment,
      this.sCommentEnding,
      this.sCommentEnded,
      this.sCData,
      this.sCDataEnding,
      this.sCDataEnding2,
      this.sPIFirstChar,
      this.sPIRest,
      this.sPIBody,
      this.sPIEnding,
      this.sXMLDeclNameStart,
      this.sXMLDeclName,
      this.sXMLDeclEq,
      this.sXMLDeclValueStart,
      this.sXMLDeclValue,
      this.sXMLDeclSeparator,
      this.sXMLDeclEnding,
      this.sOpenTag,
      this.sOpenTagSlash,
      this.sAttrib,
      this.sAttribName,
      this.sAttribNameSawWhite,
      this.sAttribValue,
      this.sAttribValueQuoted,
      this.sAttribValueClosed,
      this.sAttribValueUnquoted,
      this.sCloseTag,
      this.sCloseTagSawWhite
      /* eslint-enable @typescript-eslint/unbound-method */
    ];

    this._init();
  }

  _init(): void {
    this.openWakaBang = '';
    this.text = '';
    this.name = '';
    this.piTarget = '';
    this.entity = '';

    this.q = null;
    this.tags = [];
    this.tag = null;
    this.topNS = null;
    this.chunk = '';
    this.chunkPosition = 0;
    this.i = 0;
    this.prevI = 0;
    this.carriedFromPrevious = undefined;
    this.forbiddenState = FORBIDDEN_START;
    this.attribList = [];

    // The logic is organized so as to minimize the need to check
    // this.opt.fragment while parsing.

    const {fragmentOpt} = this;
    this.state = fragmentOpt ? S_TEXT : S_BEGIN;
    // We want these to be all true if we are dealing with a fragment.
    this.reportedTextBeforeRoot =
      this.reportedTextAfterRoot =
      this.closedRoot =
      this.sawRoot =
        fragmentOpt;
    // An XML declaration is initially possible only when parsing whole
    // documents.
    this.xmlDeclPossible = !fragmentOpt;

    this.xmlDeclExpects = ['version'];
    this.entityReturnState = undefined;

    let {defaultXMLVersion} = this.opt;
    if (defaultXMLVersion === undefined) {
      if (this.opt.forceXMLVersion === true) {
        throw new Error('forceXMLVersion set but defaultXMLVersion is not set');
      }
      defaultXMLVersion = '1.0';
    }
    this.setXMLVersion(defaultXMLVersion);

    this.positionAtNewLine = 0;

    this.doctype = false;
    this._closed = false;

    this.xmlDecl = {
      version: undefined,
      encoding: undefined,
      standalone: undefined
    };

    this.line = 1;
    this.column = 0;

    this.ENTITIES = Object.create(XML_ENTITIES) as Record<string, string>;

    this.readyHandler?.();
  }

  /**
   * The stream position the parser is currently looking at. This field is
   * zero-based.
   *
   * This field is not based on counting Unicode characters but is to be
   * interpreted as a plain index into a JavaScript string.
   */
  get position(): number {
    return this.chunkPosition + this.i;
  }

  /**
   * The column number of the next character to be read by the parser.  *
   * This field is zero-based. (The first column in a line is 0.)
   *
   * This field reports the index at which the next character would be in the
   * line if the line were represented as a JavaScript string.  Note that this
   * *can* be different to a count based on the number of *Unicode characters*
   * due to how JavaScript handles astral plane characters.
   *
   * See [[column]] for a number that corresponds to a count of Unicode
   * characters.
   */
  get columnIndex(): number {
    return this.position - this.positionAtNewLine;
  }

  /**
   * Set an event listener on an event. The parser supports one handler per
   * event type. If you try to set an event handler over an existing handler,
   * the old handler is silently overwritten.
   *
   * @param name The event to listen to.
   *
   * @param handler The handler to set.
   */
  on<N extends EventName>(name: N, handler: EventNameToHandler<O, N>): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (this as any)[EVENT_NAME_TO_HANDLER_NAME[name]] = handler;
  }

  /**
   * Unset an event handler.
   *
   * @parma name The event to stop listening to.
   */
  off(name: EventName): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (this as any)[EVENT_NAME_TO_HANDLER_NAME[name]] = undefined;
  }

  /**
   * Make an error object. The error object will have a message that contains
   * the ``fileName`` option passed at the creation of the parser. If position
   * tracking was turned on, it will also have line and column number
   * information.
   *
   * @param message The message describing the error to report.
   *
   * @returns An error object with a properly formatted message.
   */
  makeError(message: string): Error {
    let msg = this.fileName ?? '';
    if (this.trackPosition) {
      if (msg.length > 0) {
        msg += ':';
      }
      msg += `${this.line}:${this.column}`;
    }
    if (msg.length > 0) {
      msg += ': ';
    }
    return new Error(msg + message);
  }

  /**
   * Report a parsing error. This method is made public so that client code may
   * check for issues that are outside the scope of this project and can report
   * errors.
   *
   * @param message The error to report.
   *
   * @returns this
   */
  fail(message: string): this {
    const err = this.makeError(message);
    const handler = this.errorHandler;
    if (handler === undefined) {
      throw err;
    } else {
      handler(err);
    }
    return this;
  }

  /**
   * Write a XML data to the parser.
   *
   * @param chunk The XML data to write.
   *
   * @returns this
   */
  // We do need object for the type here. Yes, it often causes problems
  // but not in this case.
  write(chunk: string | object | null): this {
    if (this.closed) {
      return this.fail('cannot write after close; assign an onready handler.');
    }

    let end = false;
    if (chunk === null) {
      // We cannot return immediately because carriedFromPrevious may need
      // processing.
      end = true;
      chunk = '';
    } else if (typeof chunk === 'object') {
      chunk = chunk.toString();
    }

    // We checked if performing a pre-decomposition of the string into an array
    // of single complete characters (``Array.from(chunk)``) would be faster
    // than the current repeated calls to ``charCodeAt``. As of August 2018, it
    // isn't. (There may be Node-specific code that would perform faster than
    // ``Array.from`` but don't want to be dependent on Node.)

    if (this.carriedFromPrevious !== undefined) {
      // The previous chunk had char we must carry over.
      chunk = `${this.carriedFromPrevious}${chunk}`;
      this.carriedFromPrevious = undefined;
    }

    let limit = chunk.length;
    const lastCode = chunk.charCodeAt(limit - 1);
    if (
      !end &&
      // A trailing CR or surrogate must be carried over to the next
      // chunk.
      (lastCode === CR || (lastCode >= 0xd800 && lastCode <= 0xdbff))
    ) {
      // The chunk ends with a character that must be carried over. We cannot
      // know how to handle it until we get the next chunk or the end of the
      // stream. So save it for later.
      this.carriedFromPrevious = chunk[limit - 1];
      limit--;
      chunk = chunk.slice(0, limit);
    }

    const {stateTable} = this;
    this.chunk = chunk;
    this.i = 0;
    while (this.i < limit) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      stateTable[this.state].call(this as any);
    }
    this.chunkPosition += limit;

    return end ? this.end() : this;
  }

  /**
   * Close the current stream. Perform final well-formedness checks and reset
   * the parser tstate.
   *
   * @returns this
   */
  close(): this {
    return this.write(null);
  }

  /**
   * Get a single code point out of the current chunk. This updates the current
   * position if we do position tracking.
   *
   * This is the algorithm to use for XML 1.0.
   *
   * @returns The character read.
   */
  private getCode10(): number {
    const {chunk, i} = this;
    this.prevI = i;
    // Yes, we do this instead of doing this.i++. Doing it this way, we do not
    // read this.i again, which is a bit faster.
    this.i = i + 1;

    if (i >= chunk.length) {
      return EOC;
    }

    // Using charCodeAt and handling the surrogates ourselves is faster
    // than using codePointAt.
    const code = chunk.charCodeAt(i);

    this.column++;
    if (code < 0xd800) {
      if (code >= SPACE || code === TAB) {
        return code;
      }

      switch (code) {
        case NL:
          this.line++;
          this.column = 0;
          this.positionAtNewLine = this.position;
          return NL;
        case CR:
          // We may get NaN if we read past the end of the chunk, which is fine.
          if (chunk.charCodeAt(i + 1) === NL) {
            // A \r\n sequence is converted to \n so we have to skip over the
            // next character. We already know it has a size of 1 so ++ is fine
            // here.
            this.i = i + 2;
          }
          // Otherwise, a \r is just converted to \n, so we don't have to skip
          // ahead.

          // In either case, \r becomes \n.
          this.line++;
          this.column = 0;
          this.positionAtNewLine = this.position;
          return NL_LIKE;
        default:
          // If we get here, then code < SPACE and it is not NL CR or TAB.
          this.fail('disallowed character.');
          return code;
      }
    }

    if (code > 0xdbff) {
      // This is a specialized version of isChar10 that takes into account
      // that in this context code > 0xDBFF and code <= 0xFFFF. So it does not
      // test cases that don't need testing.
      if (!(code >= 0xe000 && code <= 0xfffd)) {
        this.fail('disallowed character.');
      }

      return code;
    }

    const final =
      0x10000 + (code - 0xd800) * 0x400 + (chunk.charCodeAt(i + 1) - 0xdc00);
    this.i = i + 2;

    // This is a specialized version of isChar10 that takes into account that in
    // this context necessarily final >= 0x10000.
    if (final > 0x10ffff) {
      this.fail('disallowed character.');
    }

    return final;
  }

  /**
   * Get a single code point out of the current chunk. This updates the current
   * position if we do position tracking.
   *
   * This is the algorithm to use for XML 1.1.
   *
   * @returns {number} The character read.
   */
  private getCode11(): number {
    const {chunk, i} = this;
    this.prevI = i;
    // Yes, we do this instead of doing this.i++. Doing it this way, we do not
    // read this.i again, which is a bit faster.
    this.i = i + 1;

    if (i >= chunk.length) {
      return EOC;
    }

    // Using charCodeAt and handling the surrogates ourselves is faster
    // than using codePointAt.
    const code = chunk.charCodeAt(i);

    this.column++;
    if (code < 0xd800) {
      if (
        (code > 0x1f && code < 0x7f) ||
        (code > 0x9f && code !== LS) ||
        code === TAB
      ) {
        return code;
      }

      switch (code) {
        case NL: // 0xA
          this.line++;
          this.column = 0;
          this.positionAtNewLine = this.position;
          return NL;
        case CR: {
          // 0xD
          // We may get NaN if we read past the end of the chunk, which is
          // fine.
          const next = chunk.charCodeAt(i + 1);
          if (next === NL || next === NEL) {
            // A CR NL or CR NEL sequence is converted to NL so we have to skip
            // over the next character. We already know it has a size of 1.
            this.i = i + 2;
          }
          // Otherwise, a CR is just converted to NL, no skip.
        }
        /* yes, fall through */
        case NEL: // 0x85
        case LS: // Ox2028
          this.line++;
          this.column = 0;
          this.positionAtNewLine = this.position;
          return NL_LIKE;
        default:
          this.fail('disallowed character.');
          return code;
      }
    }

    if (code > 0xdbff) {
      // This is a specialized version of isCharAndNotRestricted that takes into
      // account that in this context code > 0xDBFF and code <= 0xFFFF. So it
      // does not test cases that don't need testing.
      if (!(code >= 0xe000 && code <= 0xfffd)) {
        this.fail('disallowed character.');
      }

      return code;
    }

    const final =
      0x10000 + (code - 0xd800) * 0x400 + (chunk.charCodeAt(i + 1) - 0xdc00);
    this.i = i + 2;

    // This is a specialized version of isCharAndNotRestricted that takes into
    // account that in this context necessarily final >= 0x10000.
    if (final > 0x10ffff) {
      this.fail('disallowed character.');
    }

    return final;
  }

  /**
   * Like ``getCode`` but with the return value normalized so that ``NL`` is
   * returned for ``NL_LIKE``.
   */
  private getCodeNorm(): number {
    const c = this.getCode();
    return c === NL_LIKE ? NL : c;
  }

  private unget(): void {
    this.i = this.prevI;
    this.column--;
  }

  /**
   * Capture characters into a buffer until encountering one of a set of
   * characters.
   *
   * @param chars An array of codepoints. Encountering a character in the array
   * ends the capture. (``chars`` may safely contain ``NL``.)
   *
   * @return The character code that made the capture end, or ``EOC`` if we hit
   * the end of the chunk. The return value cannot be NL_LIKE: NL is returned
   * instead.
   */
  private captureTo(chars: number[]): number {
    let {i: start} = this;
    const {chunk} = this;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const c = this.getCode();
      const isNLLike = c === NL_LIKE;
      const final = isNLLike ? NL : c;
      if (final === EOC || chars.includes(final)) {
        this.text += chunk.slice(start, this.prevI);
        return final;
      }

      if (isNLLike) {
        this.text += `${chunk.slice(start, this.prevI)}\n`;
        start = this.i;
      }
    }
  }

  /**
   * Capture characters into a buffer until encountering a character.
   *
   * @param char The codepoint that ends the capture. **NOTE ``char`` MAY NOT
   * CONTAIN ``NL``.** Passing ``NL`` will result in buggy behavior.
   *
   * @return ``true`` if we ran into the character. Otherwise, we ran into the
   * end of the current chunk.
   */
  private captureToChar(char: number): boolean {
    let {i: start} = this;
    const {chunk} = this;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let c = this.getCode();
      switch (c) {
        case NL_LIKE:
          this.text += `${chunk.slice(start, this.prevI)}\n`;
          start = this.i;
          c = NL;
          break;
        case EOC:
          this.text += chunk.slice(start);
          return false;
        default:
      }

      if (c === char) {
        this.text += chunk.slice(start, this.prevI);
        return true;
      }
    }
  }

  /**
   * Capture characters that satisfy ``isNameChar`` into the ``name`` field of
   * this parser.
   *
   * @return The character code that made the test fail, or ``EOC`` if we hit
   * the end of the chunk. The return value cannot be NL_LIKE: NL is returned
   * instead.
   */
  private captureNameChars(): number {
    const {chunk, i: start} = this;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const c = this.getCode();
      if (c === EOC) {
        this.name += chunk.slice(start);
        return EOC;
      }

      // NL is not a name char so we don't have to test specifically for it.
      if (!isNameChar(c)) {
        this.name += chunk.slice(start, this.prevI);
        return c === NL_LIKE ? NL : c;
      }
    }
  }

  /**
   * Skip white spaces.
   *
   * @return The character that ended the skip, or ``EOC`` if we hit
   * the end of the chunk. The return value cannot be NL_LIKE: NL is returned
   * instead.
   */
  private skipSpaces(): number {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const c = this.getCodeNorm();
      if (c === EOC || !isS(c)) {
        return c;
      }
    }
  }

  private setXMLVersion(version: string): void {
    this.currentXMLVersion = version;
    /*  eslint-disable @typescript-eslint/unbound-method */
    if (version === '1.0') {
      this.isChar = isChar10;
      this.getCode = this.getCode10;
    } else {
      this.isChar = isChar11;
      this.getCode = this.getCode11;
    }
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  // STATE ENGINE METHODS

  // This needs to be a state separate from S_BEGIN_WHITESPACE because we want
  // to be sure never to come back to this state later.
  private sBegin(): void {
    // We are essentially peeking at the first character of the chunk. Since
    // S_BEGIN can be in effect only when we start working on the first chunk,
    // the index at which we must look is necessarily 0. Note also that the
    // following test does not depend on decoding surrogates.

    // If the initial character is 0xFEFF, ignore it.
    if (this.chunk.charCodeAt(0) === 0xfeff) {
      this.i++;
      this.column++;
    }

    this.state = S_BEGIN_WHITESPACE;
  }

  private sBeginWhitespace(): void {
    // We need to know whether we've encountered spaces or not because as soon
    // as we run into a space, an XML declaration is no longer possible. Rather
    // than slow down skipSpaces even in places where we don't care whether it
    // skipped anything or not, we check whether prevI is equal to the value of
    // i from before we skip spaces.
    const iBefore = this.i;
    const c = this.skipSpaces();
    if (this.prevI !== iBefore) {
      this.xmlDeclPossible = false;
    }

    switch (c) {
      case LESS:
        this.state = S_OPEN_WAKA;
        // We could naively call closeText but in this state, it is not normal
        // to have text be filled with any data.
        if (this.text.length !== 0) {
          throw new Error('no-empty text at start');
        }
        break;
      case EOC:
        break;
      default:
        this.unget();
        this.state = S_TEXT;
        this.xmlDeclPossible = false;
    }
  }

  private sDoctype(): void {
    const c = this.captureTo(DOCTYPE_TERMINATOR);
    switch (c) {
      case GREATER: {
        this.doctypeHandler?.(this.text);
        this.text = '';
        this.state = S_TEXT;
        this.doctype = true; // just remember that we saw it.
        break;
      }
      case EOC:
        break;
      default:
        this.text += String.fromCodePoint(c);
        if (c === OPEN_BRACKET) {
          this.state = S_DTD;
        } else if (isQuote(c)) {
          this.state = S_DOCTYPE_QUOTE;
          this.q = c;
        }
    }
  }

  private sDoctypeQuote(): void {
    const q = this.q!;
    if (this.captureToChar(q)) {
      this.text += String.fromCodePoint(q);
      this.q = null;
      this.state = S_DOCTYPE;
    }
  }

  private sDTD(): void {
    const c = this.captureTo(DTD_TERMINATOR);
    if (c === EOC) {
      return;
    }

    this.text += String.fromCodePoint(c);
    if (c === CLOSE_BRACKET) {
      this.state = S_DOCTYPE;
    } else if (c === LESS) {
      this.state = S_DTD_OPEN_WAKA;
    } else if (isQuote(c)) {
      this.state = S_DTD_QUOTED;
      this.q = c;
    }
  }

  private sDTDQuoted(): void {
    const q = this.q!;
    if (this.captureToChar(q)) {
      this.text += String.fromCodePoint(q);
      this.state = S_DTD;
      this.q = null;
    }
  }

  private sDTDOpenWaka(): void {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    switch (c) {
      case BANG:
        this.state = S_DTD_OPEN_WAKA_BANG;
        this.openWakaBang = '';
        break;
      case QUESTION:
        this.state = S_DTD_PI;
        break;
      default:
        this.state = S_DTD;
    }
  }

  private sDTDOpenWakaBang(): void {
    const char = String.fromCodePoint(this.getCodeNorm());
    const owb = (this.openWakaBang += char);
    this.text += char;
    if (owb !== '-') {
      this.state = owb === '--' ? S_DTD_COMMENT : S_DTD;
      this.openWakaBang = '';
    }
  }

  private sDTDComment(): void {
    if (this.captureToChar(MINUS)) {
      this.text += '-';
      this.state = S_DTD_COMMENT_ENDING;
    }
  }

  private sDTDCommentEnding(): void {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    this.state = c === MINUS ? S_DTD_COMMENT_ENDED : S_DTD_COMMENT;
  }

  private sDTDCommentEnded(): void {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    if (c === GREATER) {
      this.state = S_DTD;
    } else {
      this.fail('malformed comment.');
      // <!-- blah -- bloo --> will be recorded as
      // a comment of " blah -- bloo "
      this.state = S_DTD_COMMENT;
    }
  }

  private sDTDPI(): void {
    if (this.captureToChar(QUESTION)) {
      this.text += '?';
      this.state = S_DTD_PI_ENDING;
    }
  }

  private sDTDPIEnding(): void {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    if (c === GREATER) {
      this.state = S_DTD;
    }
  }

  private sText(): void {
    //
    // We did try a version of saxes where the S_TEXT state was split in two
    // states: one for text inside the root element, and one for text
    // outside. This was avoiding having to test this.tags.length to decide
    // what implementation to actually use.
    //
    // Peformance testing on gigabyte-size files did not show any advantage to
    // using the two states solution instead of the current one. Conversely, it
    // made the code a bit more complicated elsewhere. For instance, a comment
    // can appear before the root element so when a comment ended it was
    // necessary to determine whether to return to the S_TEXT state or to the
    // new text-outside-root state.
    //
    if (this.tags.length !== 0) {
      this.handleTextInRoot();
    } else {
      this.handleTextOutsideRoot();
    }
  }

  private sEntity(): void {
    // This is essentially a specialized version of captureToChar(SEMICOLON...)
    let {i: start} = this;
    const {chunk} = this;
    // eslint-disable-next-line no-labels, no-restricted-syntax
    // eslint-disable-next-line no-constant-condition
    loop: while (true) {
      switch (this.getCode()) {
        case NL_LIKE:
          this.entity += `${chunk.slice(start, this.prevI)}\n`;
          start = this.i;
          break;
        case SEMICOLON: {
          const {entityReturnState} = this;
          const entity = this.entity + chunk.slice(start, this.prevI);
          this.state = entityReturnState!;
          let parsed: string;
          if (entity === '') {
            this.fail('empty entity name.');
            parsed = '&;';
          } else {
            parsed = this.parseEntity(entity);
            this.entity = '';
          }

          if (entityReturnState !== S_TEXT || this.textHandler !== undefined) {
            this.text += parsed;
          }
          // eslint-disable-next-line no-labels
          break loop;
        }
        case EOC:
          this.entity += chunk.slice(start);
          // eslint-disable-next-line no-labels
          break loop;
        default:
      }
    }
  }

  private sOpenWaka(): void {
    // Reminder: a state handler is called with at least one character
    // available in the current chunk. So the first call to get code inside of
    // a state handler cannot return ``EOC``. That's why we don't test
    // for it.
    const c = this.getCode();
    // either a /, ?, !, or text is coming next.
    if (isNameStartChar(c)) {
      this.state = S_OPEN_TAG;
      this.unget();
      this.xmlDeclPossible = false;
    } else {
      switch (c) {
        case FORWARD_SLASH:
          this.state = S_CLOSE_TAG;
          this.xmlDeclPossible = false;
          break;
        case BANG:
          this.state = S_OPEN_WAKA_BANG;
          this.openWakaBang = '';
          this.xmlDeclPossible = false;
          break;
        case QUESTION:
          this.state = S_PI_FIRST_CHAR;
          break;
        default:
          this.fail('disallowed character in tag name');
          this.state = S_TEXT;
          this.xmlDeclPossible = false;
      }
    }
  }

  private sOpenWakaBang(): void {
    this.openWakaBang += String.fromCodePoint(this.getCodeNorm());
    switch (this.openWakaBang) {
      case '[CDATA[':
        if (!this.sawRoot && !this.reportedTextBeforeRoot) {
          this.fail('text data outside of root node.');
          this.reportedTextBeforeRoot = true;
        }

        if (this.closedRoot && !this.reportedTextAfterRoot) {
          this.fail('text data outside of root node.');
          this.reportedTextAfterRoot = true;
        }
        this.state = S_CDATA;
        this.openWakaBang = '';
        break;
      case '--':
        this.state = S_COMMENT;
        this.openWakaBang = '';
        break;
      case 'DOCTYPE':
        this.state = S_DOCTYPE;
        if (this.doctype || this.sawRoot) {
          this.fail('inappropriately located doctype declaration.');
        }
        this.openWakaBang = '';
        break;
      default:
        // 7 happens to be the maximum length of the string that can possibly
        // match one of the cases above.
        if (this.openWakaBang.length >= 7) {
          this.fail('incorrect syntax.');
        }
    }
  }

  private sComment(): void {
    if (this.captureToChar(MINUS)) {
      this.state = S_COMMENT_ENDING;
    }
  }

  private sCommentEnding(): void {
    const c = this.getCodeNorm();
    if (c === MINUS) {
      this.state = S_COMMENT_ENDED;
      this.commentHandler?.(this.text);
      this.text = '';
    } else {
      this.text += `-${String.fromCodePoint(c)}`;
      this.state = S_COMMENT;
    }
  }

  private sCommentEnded(): void {
    const c = this.getCodeNorm();
    if (c !== GREATER) {
      this.fail('malformed comment.');
      // <!-- blah -- bloo --> will be recorded as
      // a comment of " blah -- bloo "
      this.text += `--${String.fromCodePoint(c)}`;
      this.state = S_COMMENT;
    } else {
      this.state = S_TEXT;
    }
  }

  private sCData(): void {
    if (this.captureToChar(CLOSE_BRACKET)) {
      this.state = S_CDATA_ENDING;
    }
  }

  private sCDataEnding(): void {
    const c = this.getCodeNorm();
    if (c === CLOSE_BRACKET) {
      this.state = S_CDATA_ENDING_2;
    } else {
      this.text += `]${String.fromCodePoint(c)}`;
      this.state = S_CDATA;
    }
  }

  private sCDataEnding2(): void {
    const c = this.getCodeNorm();
    switch (c) {
      case GREATER: {
        this.cdataHandler?.(this.text);
        this.text = '';
        this.state = S_TEXT;
        break;
      }
      case CLOSE_BRACKET:
        this.text += ']';
        break;
      default:
        this.text += `]]${String.fromCodePoint(c)}`;
        this.state = S_CDATA;
    }
  }

  // We need this separate state to check the first character fo the pi target
  // with this.nameStartCheck which allows less characters than this.nameCheck.
  private sPIFirstChar(): void {
    const c = this.getCodeNorm();
    // This is first because in the case where the file is well-formed this is
    // the branch taken. We optimize for well-formedness.
    if (this.nameStartCheck(c)) {
      this.piTarget += String.fromCodePoint(c);
      this.state = S_PI_REST;
    } else if (c === QUESTION || isS(c)) {
      this.fail('processing instruction without a target.');
      this.state = c === QUESTION ? S_PI_ENDING : S_PI_BODY;
    } else {
      this.fail('disallowed character in processing instruction name.');
      this.piTarget += String.fromCodePoint(c);
      this.state = S_PI_REST;
    }
  }

  private sPIRest(): void {
    // Capture characters into a piTarget while ``this.nameCheck`` run on the
    // character read returns true.
    const {chunk, i: start} = this;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const c = this.getCodeNorm();
      if (c === EOC) {
        this.piTarget += chunk.slice(start);
        return;
      }

      // NL cannot satisfy this.nameCheck so we don't have to test specifically
      // for it.
      if (!this.nameCheck(c)) {
        this.piTarget += chunk.slice(start, this.prevI);
        const isQuestion = c === QUESTION;
        if (isQuestion || isS(c)) {
          if (this.piTarget === 'xml') {
            if (!this.xmlDeclPossible) {
              this.fail(
                'an XML declaration must be at the start of the document.'
              );
            }

            this.state = isQuestion ? S_XML_DECL_ENDING : S_XML_DECL_NAME_START;
          } else {
            this.state = isQuestion ? S_PI_ENDING : S_PI_BODY;
          }
        } else {
          this.fail('disallowed character in processing instruction name.');
          this.piTarget += String.fromCodePoint(c);
        }
        break;
      }
    }
  }

  private sPIBody(): void {
    if (this.text.length === 0) {
      const c = this.getCodeNorm();
      if (c === QUESTION) {
        this.state = S_PI_ENDING;
      } else if (!isS(c)) {
        this.text = String.fromCodePoint(c);
      }
    }
    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    else if (this.captureToChar(QUESTION)) {
      this.state = S_PI_ENDING;
    }
  }

  private sPIEnding(): void {
    const c = this.getCodeNorm();
    if (c === GREATER) {
      const {piTarget} = this;
      if (piTarget.toLowerCase() === 'xml') {
        this.fail(
          'the XML declaration must appear at the start of the document.'
        );
      }
      this.piHandler?.({
        target: piTarget,
        body: this.text
      });
      this.piTarget = this.text = '';
      this.state = S_TEXT;
    } else if (c === QUESTION) {
      // We ran into ?? as part of a processing instruction. We initially took
      // the first ? as a sign that the PI was ending, but it is not. So we have
      // to add it to the body but we take the new ? as a sign that the PI is
      // ending.
      this.text += '?';
    } else {
      this.text += `?${String.fromCodePoint(c)}`;
      this.state = S_PI_BODY;
    }
    this.xmlDeclPossible = false;
  }

  private sXMLDeclNameStart(): void {
    const c = this.skipSpaces();

    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    if (c === QUESTION) {
      // It is valid to go to S_XML_DECL_ENDING from this state.
      this.state = S_XML_DECL_ENDING;
      return;
    }

    if (c !== EOC) {
      this.state = S_XML_DECL_NAME;
      this.name = String.fromCodePoint(c);
    }
  }

  private sXMLDeclName(): void {
    const c = this.captureTo(XML_DECL_NAME_TERMINATOR);
    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    if (c === QUESTION) {
      this.state = S_XML_DECL_ENDING;
      this.name += this.text;
      this.text = '';
      this.fail('XML declaration is incomplete.');
      return;
    }

    if (!(isS(c) || c === EQUAL)) {
      return;
    }

    this.name += this.text;
    this.text = '';
    if (!this.xmlDeclExpects.includes(this.name)) {
      switch (this.name.length) {
        case 0:
          this.fail('did not expect any more name/value pairs.');
          break;
        case 1:
          this.fail(`expected the name ${this.xmlDeclExpects[0]}.`);
          break;
        default:
          this.fail(`expected one of ${this.xmlDeclExpects.join(', ')}`);
      }
    }

    this.state = c === EQUAL ? S_XML_DECL_VALUE_START : S_XML_DECL_EQ;
  }

  private sXMLDeclEq(): void {
    const c = this.getCodeNorm();
    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    if (c === QUESTION) {
      this.state = S_XML_DECL_ENDING;
      this.fail('XML declaration is incomplete.');
      return;
    }

    if (isS(c)) {
      return;
    }

    if (c !== EQUAL) {
      this.fail('value required.');
    }

    this.state = S_XML_DECL_VALUE_START;
  }

  private sXMLDeclValueStart(): void {
    const c = this.getCodeNorm();
    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    if (c === QUESTION) {
      this.state = S_XML_DECL_ENDING;
      this.fail('XML declaration is incomplete.');
      return;
    }

    if (isS(c)) {
      return;
    }

    if (!isQuote(c)) {
      this.fail('value must be quoted.');
      this.q = SPACE;
    } else {
      this.q = c;
    }

    this.state = S_XML_DECL_VALUE;
  }

  private sXMLDeclValue(): void {
    const c = this.captureTo([this.q!, QUESTION]);

    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    if (c === QUESTION) {
      this.state = S_XML_DECL_ENDING;
      this.text = '';
      this.fail('XML declaration is incomplete.');
      return;
    }

    if (c === EOC) {
      return;
    }

    const value = this.text;
    this.text = '';
    switch (this.name) {
      case 'version': {
        this.xmlDeclExpects = ['encoding', 'standalone'];
        const version = value;
        this.xmlDecl.version = version;
        // This is the test specified by XML 1.0 but it is fine for XML 1.1.
        if (!/^1\.[0-9]+$/.test(version)) {
          this.fail('version number must match /^1\\.[0-9]+$/.');
        }
        // When forceXMLVersion is set, the XML declaration is ignored.
        else if (!(this.opt.forceXMLVersion as boolean)) {
          this.setXMLVersion(version);
        }
        break;
      }
      case 'encoding':
        if (!/^[A-Za-z][A-Za-z0-9._-]*$/.test(value)) {
          this.fail(
            'encoding value must match \
/^[A-Za-z0-9][A-Za-z0-9._-]*$/.'
          );
        }
        this.xmlDeclExpects = ['standalone'];
        this.xmlDecl.encoding = value;
        break;
      case 'standalone':
        if (value !== 'yes' && value !== 'no') {
          this.fail('standalone value must match "yes" or "no".');
        }
        this.xmlDeclExpects = [];
        this.xmlDecl.standalone = value;
        break;
      default:
      // We don't need to raise an error here since we've already raised one
      // when checking what name was expected.
    }
    this.name = '';
    this.state = S_XML_DECL_SEPARATOR;
  }

  private sXMLDeclSeparator(): void {
    const c = this.getCodeNorm();

    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    if (c === QUESTION) {
      // It is valid to go to S_XML_DECL_ENDING from this state.
      this.state = S_XML_DECL_ENDING;
      return;
    }

    if (!isS(c)) {
      this.fail('whitespace required.');
      this.unget();
    }

    this.state = S_XML_DECL_NAME_START;
  }

  private sXMLDeclEnding(): void {
    const c = this.getCodeNorm();
    if (c === GREATER) {
      if (this.piTarget !== 'xml') {
        this.fail('processing instructions are not allowed before root.');
      } else if (
        this.name !== 'version' &&
        this.xmlDeclExpects.includes('version')
      ) {
        this.fail('XML declaration must contain a version.');
      }
      this.xmldeclHandler?.(this.xmlDecl);
      this.name = '';
      this.piTarget = this.text = '';
      this.state = S_TEXT;
    } else {
      // We got here because the previous character was a ?, but the question
      // mark character is not valid inside any of the XML declaration
      // name/value pairs.
      this.fail('The character ? is disallowed anywhere in XML declarations.');
    }
    this.xmlDeclPossible = false;
  }

  private sOpenTag(): void {
    const c = this.captureNameChars();
    if (c === EOC) {
      return;
    }

    const tag: SaxesTagIncomplete = (this.tag = {
      name: this.name,
      attributes: Object.create(null) as Record<string, string>
    });
    this.name = '';

    if (this.xmlnsOpt) {
      this.topNS = tag.ns = Object.create(null) as Record<string, string>;
    }

    this.openTagStartHandler?.(tag as StartTagForOptions<O>);
    this.sawRoot = true;
    if (!this.fragmentOpt && this.closedRoot) {
      this.fail('documents may contain only one root.');
    }

    switch (c) {
      case GREATER:
        this.openTag();
        break;
      case FORWARD_SLASH:
        this.state = S_OPEN_TAG_SLASH;
        break;
      default:
        if (!isS(c)) {
          this.fail('disallowed character in tag name.');
        }
        this.state = S_ATTRIB;
    }
  }

  private sOpenTagSlash(): void {
    if (this.getCode() === GREATER) {
      this.openSelfClosingTag();
    } else {
      this.fail('forward-slash in opening tag not followed by >.');
      this.state = S_ATTRIB;
    }
  }

  private sAttrib(): void {
    const c = this.skipSpaces();
    if (c === EOC) {
      return;
    }
    if (isNameStartChar(c)) {
      this.unget();
      this.state = S_ATTRIB_NAME;
    } else if (c === GREATER) {
      this.openTag();
    } else if (c === FORWARD_SLASH) {
      this.state = S_OPEN_TAG_SLASH;
    } else {
      this.fail('disallowed character in attribute name.');
    }
  }

  private sAttribName(): void {
    const c = this.captureNameChars();
    if (c === EQUAL) {
      this.state = S_ATTRIB_VALUE;
    } else if (isS(c)) {
      this.state = S_ATTRIB_NAME_SAW_WHITE;
    } else if (c === GREATER) {
      this.fail('attribute without value.');
      this.pushAttrib(this.name, this.name);
      this.name = this.text = '';
      this.openTag();
    } else if (c !== EOC) {
      this.fail('disallowed character in attribute name.');
    }
  }

  private sAttribNameSawWhite(): void {
    const c = this.skipSpaces();
    switch (c) {
      case EOC:
        return;
      case EQUAL:
        this.state = S_ATTRIB_VALUE;
        break;
      default:
        this.fail('attribute without value.');
        // Should we do this???
        // this.tag.attributes[this.name] = "";
        this.text = '';
        this.name = '';
        if (c === GREATER) {
          this.openTag();
        } else if (isNameStartChar(c)) {
          this.unget();
          this.state = S_ATTRIB_NAME;
        } else {
          this.fail('disallowed character in attribute name.');
          this.state = S_ATTRIB;
        }
    }
  }

  private sAttribValue(): void {
    const c = this.getCodeNorm();
    if (isQuote(c)) {
      this.q = c;
      this.state = S_ATTRIB_VALUE_QUOTED;
    } else if (!isS(c)) {
      this.fail('unquoted attribute value.');
      this.state = S_ATTRIB_VALUE_UNQUOTED;
      this.unget();
    }
  }

  private sAttribValueQuoted(): void {
    // We deliberately do not use captureTo here. The specialized code we use
    // here is faster than using captureTo.
    const {q, chunk} = this;
    let {i: start} = this;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      switch (this.getCode()) {
        case q:
          this.pushAttrib(
            this.name,
            this.text + chunk.slice(start, this.prevI)
          );
          this.name = this.text = '';
          this.q = null;
          this.state = S_ATTRIB_VALUE_CLOSED;
          return;
        case AMP:
          this.text += chunk.slice(start, this.prevI);
          this.state = S_ENTITY;
          this.entityReturnState = S_ATTRIB_VALUE_QUOTED;
          return;
        case NL:
        case NL_LIKE:
        case TAB:
          this.text += `${chunk.slice(start, this.prevI)} `;
          start = this.i;
          break;
        case LESS:
          this.text += chunk.slice(start, this.prevI);
          this.fail('disallowed character.');
          return;
        case EOC:
          this.text += chunk.slice(start);
          return;
        default:
      }
    }
  }

  private sAttribValueClosed(): void {
    const c = this.getCodeNorm();
    if (isS(c)) {
      this.state = S_ATTRIB;
    } else if (c === GREATER) {
      this.openTag();
    } else if (c === FORWARD_SLASH) {
      this.state = S_OPEN_TAG_SLASH;
    } else if (isNameStartChar(c)) {
      this.fail('no whitespace between attributes.');
      this.unget();
      this.state = S_ATTRIB_NAME;
    } else {
      this.fail('disallowed character in attribute name.');
    }
  }

  private sAttribValueUnquoted(): void {
    // We don't do anything regarding EOL or space handling for unquoted
    // attributes. We already have failed by the time we get here, and the
    // contract that saxes upholds states that upon failure, it is not safe to
    // rely on the data passed to event handlers (other than
    // ``onerror``). Passing "bad" data is not a problem.
    const c = this.captureTo(ATTRIB_VALUE_UNQUOTED_TERMINATOR);
    switch (c) {
      case AMP:
        this.state = S_ENTITY;
        this.entityReturnState = S_ATTRIB_VALUE_UNQUOTED;
        break;
      case LESS:
        this.fail('disallowed character.');
        break;
      case EOC:
        break;
      default:
        if (this.text.includes(']]>')) {
          this.fail('the string "]]>" is disallowed in char data.');
        }
        this.pushAttrib(this.name, this.text);
        this.name = this.text = '';
        if (c === GREATER) {
          this.openTag();
        } else {
          this.state = S_ATTRIB;
        }
    }
  }

  private sCloseTag(): void {
    const c = this.captureNameChars();
    if (c === GREATER) {
      this.closeTag();
    } else if (isS(c)) {
      this.state = S_CLOSE_TAG_SAW_WHITE;
    } else if (c !== EOC) {
      this.fail('disallowed character in closing tag.');
    }
  }

  private sCloseTagSawWhite(): void {
    switch (this.skipSpaces()) {
      case GREATER:
        this.closeTag();
        break;
      case EOC:
        break;
      default:
        this.fail('disallowed character in closing tag.');
    }
  }

  // END OF STATE ENGINE METHODS

  private handleTextInRoot(): void {
    // This is essentially a specialized version of captureTo which is optimized
    // for performing the ]]> check. A previous version of this code, checked
    // ``this.text`` for the presence of ]]>. It simplified the code but was
    // very costly when character data contained a lot of entities to be parsed.
    //
    // Since we are using a specialized loop, we also keep track of the presence
    // of ]]> in text data. The sequence ]]> is forbidden to appear as-is.
    //
    let {i: start, forbiddenState} = this;
    const {chunk, textHandler: handler} = this;
    // eslint-disable-next-line no-labels, no-restricted-syntax
    // eslint-disable-next-line no-constant-condition
    scanLoop: while (true) {
      switch (this.getCode()) {
        case LESS: {
          this.state = S_OPEN_WAKA;
          if (handler !== undefined) {
            const {text} = this;
            const slice = chunk.slice(start, this.prevI);
            if (text.length !== 0) {
              handler(text + slice);
              this.text = '';
            } else if (slice.length !== 0) {
              handler(slice);
            }
          }
          forbiddenState = FORBIDDEN_START;
          // eslint-disable-next-line no-labels
          break scanLoop;
        }
        case AMP:
          this.state = S_ENTITY;
          this.entityReturnState = S_TEXT;
          if (handler !== undefined) {
            this.text += chunk.slice(start, this.prevI);
          }
          forbiddenState = FORBIDDEN_START;
          // eslint-disable-next-line no-labels
          break scanLoop;
        case CLOSE_BRACKET:
          switch (forbiddenState) {
            case FORBIDDEN_START:
              forbiddenState = FORBIDDEN_BRACKET;
              break;
            case FORBIDDEN_BRACKET:
              forbiddenState = FORBIDDEN_BRACKET_BRACKET;
              break;
            case FORBIDDEN_BRACKET_BRACKET:
              break;
            default:
              throw new Error('impossible state');
          }
          break;
        case GREATER:
          if (forbiddenState === FORBIDDEN_BRACKET_BRACKET) {
            this.fail('the string "]]>" is disallowed in char data.');
          }
          forbiddenState = FORBIDDEN_START;
          break;
        case NL_LIKE:
          if (handler !== undefined) {
            this.text += `${chunk.slice(start, this.prevI)}\n`;
          }
          start = this.i;
          forbiddenState = FORBIDDEN_START;
          break;
        case EOC:
          if (handler !== undefined) {
            this.text += chunk.slice(start);
          }
          // eslint-disable-next-line no-labels
          break scanLoop;
        default:
          forbiddenState = FORBIDDEN_START;
      }
    }
    this.forbiddenState = forbiddenState;
  }

  private handleTextOutsideRoot(): void {
    // This is essentially a specialized version of captureTo which is optimized
    // for a specialized task. We keep track of the presence of non-space
    // characters in the text since these are errors when appearing outside the
    // document root element.
    let {i: start} = this;
    const {chunk, textHandler: handler} = this;
    let nonSpace = false;
    // eslint-disable-next-line no-labels, no-restricted-syntax
    // eslint-disable-next-line no-constant-condition
    outRootLoop: while (true) {
      const code = this.getCode();
      switch (code) {
        case LESS: {
          this.state = S_OPEN_WAKA;
          if (handler !== undefined) {
            const {text} = this;
            const slice = chunk.slice(start, this.prevI);
            if (text.length !== 0) {
              handler(text + slice);
              this.text = '';
            } else if (slice.length !== 0) {
              handler(slice);
            }
          }
          // eslint-disable-next-line no-labels
          break outRootLoop;
        }
        case AMP:
          this.state = S_ENTITY;
          this.entityReturnState = S_TEXT;
          if (handler !== undefined) {
            this.text += chunk.slice(start, this.prevI);
          }
          nonSpace = true;
          // eslint-disable-next-line no-labels
          break outRootLoop;
        case NL_LIKE:
          if (handler !== undefined) {
            this.text += `${chunk.slice(start, this.prevI)}\n`;
          }
          start = this.i;
          break;
        case EOC:
          if (handler !== undefined) {
            this.text += chunk.slice(start);
          }
          // eslint-disable-next-line no-labels
          break outRootLoop;
        default:
          if (!isS(code)) {
            nonSpace = true;
          }
      }
    }

    if (!nonSpace) {
      return;
    }

    // We use the reportedTextBeforeRoot and reportedTextAfterRoot flags
    // to avoid reporting errors for every single character that is out of
    // place.
    if (!this.sawRoot && !this.reportedTextBeforeRoot) {
      this.fail('text data outside of root node.');
      this.reportedTextBeforeRoot = true;
    }

    if (this.closedRoot && !this.reportedTextAfterRoot) {
      this.fail('text data outside of root node.');
      this.reportedTextAfterRoot = true;
    }
  }

  private pushAttribNS(name: string, value: string): void {
    const {prefix, local} = this.qname(name);
    const attr = {name, prefix, local, value};
    this.attribList.push(attr);
    this.attributeHandler?.(attr as AttributeEventForOptions<O>);
    if (prefix === 'xmlns') {
      const trimmed = value.trim();
      if (this.currentXMLVersion === '1.0' && trimmed === '') {
        this.fail('invalid attempt to undefine prefix in XML 1.0');
      }
      this.topNS![local] = trimmed;
      nsPairCheck(this, local, trimmed);
    } else if (name === 'xmlns') {
      const trimmed = value.trim();
      this.topNS![''] = trimmed;
      nsPairCheck(this, '', trimmed);
    }
  }

  private pushAttribPlain(name: string, value: string): void {
    const attr = {name, value};
    this.attribList.push(attr);
    this.attributeHandler?.(attr as AttributeEventForOptions<O>);
  }

  /**
   * End parsing. This performs final well-formedness checks and resets the
   * parser to a clean state.
   *
   * @returns this
   */
  private end(): this {
    if (!this.sawRoot) {
      this.fail('document must contain a root element.');
    }
    const {tags} = this;
    while (tags.length > 0) {
      const tag = tags.pop()!;
      this.fail(`unclosed tag: ${tag.name}`);
    }
    if (this.state !== S_BEGIN && this.state !== S_TEXT) {
      this.fail('unexpected end.');
    }
    const {text} = this;
    if (text.length !== 0) {
      this.textHandler?.(text);
      this.text = '';
    }
    this._closed = true;
    this.endHandler?.();
    this._init();
    return this;
  }

  /**
   * Resolve a namespace prefix.
   *
   * @param prefix The prefix to resolve.
   *
   * @returns The namespace URI or ``undefined`` if the prefix is not defined.
   */
  resolve(prefix: string): string | undefined {
    let uri = this.topNS![prefix];
    if (uri !== undefined) {
      return uri;
    }

    const {tags} = this;
    for (let index = tags.length - 1; index >= 0; index--) {
      uri = tags[index]!.ns![prefix];
      if (uri !== undefined) {
        return uri;
      }
    }

    uri = this.ns[prefix];
    if (uri !== undefined) {
      return uri;
    }

    return this.opt.resolvePrefix?.(prefix);
  }

  /**
   * Parse a qname into its prefix and local name parts.
   *
   * @param name The name to parse
   *
   * @returns
   */
  private qname(name: string): {prefix: string; local: string} {
    // This is faster than using name.split(":").
    const colon = name.indexOf(':');
    if (colon === -1) {
      return {prefix: '', local: name};
    }

    const local = name.slice(colon + 1);
    const prefix = name.slice(0, colon);
    if (prefix === '' || local === '' || local.includes(':')) {
      this.fail(`malformed name: ${name}.`);
    }

    return {prefix, local};
  }

  private processAttribsNS(): void {
    const {attribList} = this;
    const tag = this.tag!;

    {
      // add namespace info to tag
      const {prefix, local} = this.qname(tag.name);
      tag.prefix = prefix;
      tag.local = local;
      const uri = (tag.uri = this.resolve(prefix) ?? '');

      if (prefix !== '') {
        if (prefix === 'xmlns') {
          this.fail('tags may not have "xmlns" as prefix.');
        }

        if (uri === '') {
          this.fail(`unbound namespace prefix: ${JSON.stringify(prefix)}.`);
          tag.uri = prefix;
        }
      }
    }

    if (attribList.length === 0) {
      return;
    }

    const {attributes} = tag;
    const seen = new Set();
    // Note: do not apply default ns to attributes:
    //   http://www.w3.org/TR/REC-xml-names/#defaulting
    for (const attr of attribList as SaxesAttributeNSIncomplete[]) {
      const {name, prefix, local} = attr;
      let uri;
      let eqname;
      if (prefix === '') {
        uri = name === 'xmlns' ? XMLNS_NAMESPACE : '';
        eqname = name;
      } else {
        uri = this.resolve(prefix);
        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (uri === undefined) {
          this.fail(`unbound namespace prefix: ${JSON.stringify(prefix)}.`);
          uri = prefix;
        }
        eqname = `{${uri}}${local}`;
      }

      if (seen.has(eqname)) {
        this.fail(`duplicate attribute: ${eqname}.`);
      }
      seen.add(eqname);

      attr.uri = uri;
      attributes[name] = attr;
    }

    this.attribList = [];
  }

  private processAttribsPlain(): void {
    const {attribList} = this;
    // eslint-disable-next-line prefer-destructuring
    const attributes = this.tag!.attributes;
    for (const {name, value} of attribList) {
      if (attributes[name] !== undefined) {
        this.fail(`duplicate attribute: ${name}.`);
      }
      attributes[name] = value;
    }

    this.attribList = [];
  }

  /**
   * Handle a complete open tag. This parser code calls this once it has seen
   * the whole tag. This method checks for well-formeness and then emits
   * ``onopentag``.
   */
  private openTag(): void {
    this.processAttribs();

    const {tags} = this;
    const tag = this.tag as SaxesTag;
    tag.isSelfClosing = false;

    // There cannot be any pending text here due to the onopentagstart that was
    // necessarily emitted before we get here. So we do not check text.
    this.openTagHandler?.(tag as TagForOptions<O>);
    tags.push(tag);
    this.state = S_TEXT;
    this.name = '';
  }

  /**
   * Handle a complete self-closing tag. This parser code calls this once it has
   * seen the whole tag. This method checks for well-formeness and then emits
   * ``onopentag`` and ``onclosetag``.
   */
  private openSelfClosingTag(): void {
    this.processAttribs();

    const {tags} = this;
    const tag = this.tag as SaxesTag;
    tag.isSelfClosing = true;

    // There cannot be any pending text here due to the onopentagstart that was
    // necessarily emitted before we get here. So we do not check text.
    this.openTagHandler?.(tag as TagForOptions<O>);
    this.closeTagHandler?.(tag as TagForOptions<O>);
    const top = (this.tag = tags[tags.length - 1] ?? null);
    if (top === null) {
      this.closedRoot = true;
    }
    this.state = S_TEXT;
    this.name = '';
  }

  /**
   * Handle a complete close tag. This parser code calls this once it has seen
   * the whole tag. This method checks for well-formeness and then emits
   * ``onclosetag``.
   */
  private closeTag(): void {
    const {tags, name} = this;

    // Our state after this will be S_TEXT, no matter what, and we can clear
    // tagName now.
    this.state = S_TEXT;
    this.name = '';

    if (name === '') {
      this.fail('weird empty close tag.');
      this.text += '</>';
      return;
    }

    const handler = this.closeTagHandler;
    let l = tags.length;
    while (l-- > 0) {
      const tag = (this.tag = tags.pop() as SaxesTag);
      this.topNS = tag.ns!;
      handler?.(tag as TagForOptions<O>);
      if (tag.name === name) {
        break;
      }
      this.fail('unexpected close tag.');
    }

    if (l === 0) {
      this.closedRoot = true;
    } else if (l < 0) {
      this.fail(`unmatched closing tag: ${name}.`);
      this.text += `</${name}>`;
    }
  }

  /**
   * Resolves an entity. Makes any necessary well-formedness checks.
   *
   * @param entity The entity to resolve.
   *
   * @returns The parsed entity.
   */
  private parseEntity(entity: string): string {
    // startsWith would be significantly slower for this test.
    if (entity[0] !== '#') {
      const defined = this.ENTITIES[entity];
      if (defined !== undefined) {
        return defined;
      }

      this.fail(
        this.isName(entity)
          ? 'undefined entity.'
          : 'disallowed character in entity name.'
      );
      return `&${entity};`;
    }

    let num = NaN;
    if (entity[1] === 'x' && /^#x[0-9a-f]+$/i.test(entity)) {
      num = parseInt(entity.slice(2), 16);
    } else if (/^#[0-9]+$/.test(entity)) {
      num = parseInt(entity.slice(1), 10);
    }

    // The character reference is required to match the CHAR production.
    if (!this.isChar(num)) {
      this.fail('malformed character entity.');
      return `&${entity};`;
    }

    return String.fromCodePoint(num);
  }
}
