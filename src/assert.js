export default class Assert {
  /**
   * @param {Boolean} success
   * @param {String} [message]
   * @throws {Error}
   */
  constructor (success, message = 'Assertion failed') {
    if (!success) {
      throw new Error(message)
    }
  }

  /**
   * @param {Boolean} condition
   * @param {String} message
   * @returns {Assert}
   * @throws {Error}
   */
  static true (condition, message) {
    return new Assert(condition, message)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static exists (thing) {
    return Assert.true(!_.isNil(thing), `${thing} does not exist`)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static notEmpty (thing) {
    return Assert.true(!_.isEmpty(thing), `${thing} is empty`)
  }

  /**
   * @param {*} thing
   * @param {Object|Object[]} constructor A constructor or Array of constructors
   * @param {Boolean} [optional] - Set if thing can be undefined or null
   * @returns {Assert}
   * @throws {Error}
   */
  static instance (thing, constructor, optional = false) {
    if (optional && _.isNil(thing)) return

    let condition

    if (Array.isArray(constructor)) {
      condition = constructor.some(item => thing instanceof item)
    } else {
      condition = thing instanceof constructor
    }

    if (!condition) console.log(thing)

    return Assert.true(condition, `${thing} is not an instance of ${constructor.name}`)
  }

  /**
   * @param {*} thing
   * @param {Assert.Types|String} type
   * @returns {Assert}
   * @throws {Error}
   */
  static type (thing, type) {
    let condition

    switch (type) {
      case Assert.Types.Array:
        condition = _.isArray(thing)
        break
      case Assert.Types.PlainObject:
        condition = _.isPlainObject(thing)
        break
      case Assert.Types.Null:
        condition = _.isNull(thing)
        break
      case Assert.Types.Nil:
        condition = _.isNil(thing)
        break
      default:
        if (Object.values(Assert.Types).includes(type)) {
        // eslint-disable-next-line valid-typeof
          condition = typeof thing === type
        } else {
          return Assert.instance(thing, type)
        }
    }

    return Assert.true(condition, `${thing} is not of type ${type}`)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static number (thing) {
    return Assert.type(thing, Assert.Types.Number)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static string (thing) {
    return Assert.type(thing, Assert.Types.String)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static boolean (thing) {
    return Assert.type(thing, Assert.Types.Boolean)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static array (thing) {
    return Assert.type(thing, Assert.Types.Array)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static plainObject (thing) {
    return Assert.type(thing, Assert.Types.PlainObject)
  }

  /**
   * @param {*} thing
   * @returns {Assert}
   * @throws {Error}
   */
  static function (thing) {
    return Assert.type(thing, Assert.Types.Function)
  }
}

/**
 * @enum {String}
 */
Assert.Types = {
  Array: 'array',
  Object: 'object',
  PlainObject: 'plainObject',
  Undefined: 'undefined',
  Null: 'null',
  Nil: 'nil',
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  Function: 'function',
  Symbol: 'symbol'
}
Object.freeze(Assert.Types)
