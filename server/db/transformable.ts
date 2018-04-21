export interface ITransformable<T> {
  _transform(): T;
  _assimilate(origin: T): void;
}