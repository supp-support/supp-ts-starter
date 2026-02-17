import { Supp } from "supp-ts";

let _supp: Supp | null = null;

export function getSupp(): Supp {
  if (!_supp) {
    const key = process.env.SUPP_SECRET_KEY;
    if (!key) {
      throw new Error(
        "Missing SUPP_SECRET_KEY environment variable. Get one at https://supp.support/dashboard"
      );
    }
    _supp = new Supp(key);
  }
  return _supp;
}
