-- =============================================================================
-- 0004 — Membership authority: the owner role is owner-controlled.
--
-- RLS (0001) already prevents cross-tenant access and lets admins manage the
-- roster. This migration closes the one intra-tenant gap an audit surfaced:
-- without it, an *admin* could grant themselves (or anyone) the `owner` role,
-- or strip an owner — a privilege-escalation path. Here, only an existing owner
-- may assign, change, or remove the `owner` role.
--
-- The bootstrap case (the very first membership of a fresh org, inserted by the
-- SECURITY DEFINER `create_organization`) is explicitly allowed — there is no
-- owner yet to authorize it. Complements the existing `protect_last_owner`
-- trigger, which guarantees an org never loses its final owner.
-- =============================================================================

create or replace function public.enforce_owner_authority()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org uuid := coalesce(new.org_id, old.org_id);
  touches_owner boolean :=
       (tg_op = 'INSERT' and new.role = 'owner')
    or (tg_op = 'UPDATE' and (new.role = 'owner' or old.role = 'owner')
        and new.role is distinct from old.role)
    or (tg_op = 'DELETE' and old.role = 'owner');
begin
  if touches_owner then
    -- Bootstrap: first membership of a brand-new org (create_organization).
    if tg_op = 'INSERT'
       and not exists (select 1 from public.org_members m where m.org_id = v_org) then
      return new;
    end if;
    if not public.has_min_org_role(v_org, 'owner') then
      raise exception 'Only an owner can assign, change, or remove the owner role';
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger org_members_enforce_owner_authority
  before insert or update or delete on public.org_members
  for each row execute function public.enforce_owner_authority();
